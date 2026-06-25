
import React from "react"
import { getJokeFromMistral } from "./ai"

import JokeSection from "./JokeSection";

export default function Body() {

    const [keywords, setKeywords] = React.useState([]);
    const [editingIndex, setEditingIndex] = React.useState(-1);
    const [editedValue, setEditedValue] = React.useState("");
    const [undoStack, setUndoStack] = React.useState([]);

    const addToUndoStack = (action) => {
        setUndoStack((prev) => [...prev, action]);
    };

    const handleUndo = () => {
        if (undoStack.length > 0) {
            const lastAction = undoStack[undoStack.length - 1];
            setUndoStack((prev) => prev.slice(0, -1));
            lastAction.undo();
        }
    };

    const startEditing = (index, currentValue) => {
        setEditingIndex(index);
        setEditedValue(currentValue);
    };

    const saveEdit = (index) => {
        if (editedValue.trim() === "") {
            deleteKeyword(index);
            return;
        }
        setKeywords((prev) => {
            const newKeywords = [...prev];
            const oldValue = newKeywords[index];
            newKeywords[index] = editedValue.trim();
            addToUndoStack(() => {
                setKeywords((prev) => {
                    const newPrev = [...prev];
                    newPrev[index] = oldValue;
                    return newPrev;
                });
            });
            return newKeywords;
        });
        setEditingIndex(-1);
        setEditedValue("");
    };

    const cancelEdit = () => {
        setEditingIndex(-1);
        setEditedValue("");
    };

    const deleteKeyword = (index) => {
        const deletedKeyword = keywords[index];
        setKeywords((prev) => prev.filter((_, i) => i !== index));
        addToUndoStack(() => {
            setKeywords((prev) => {
                const newPrev = [...prev];
                newPrev.splice(index, 0, deletedKeyword);
                return newPrev;
            });
        });
    };

    function handleSubmit(formData) {
        const newKeyword = formData.get("keywords");

        //empty check
        if (newKeyword === "") {
            return
        }

        //add newKeyword to the array
        setKeywords((prevKeywords) => {
            return (
                [...prevKeywords, newKeyword]
            )
        })
    }

    const [joke, setJoke] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)

    async function getJoke() {
        setJoke("")
        setIsLoading(true)   
        const jokeMarkdown = await getJokeFromMistral(keywords)
        console.log(jokeMarkdown)
        setJoke(jokeMarkdown)
        setIsLoading(false)  
}

    const keyword_list = keywords.map((keyword, index) => {
        const isEditing = editingIndex === index;

        return (
            <li id="typed-keywords" key={keyword} className="keyword-item">
                {isEditing ? (
                    <div className="edit-mode">
                        <input
                            type="text"
                            value={editedValue}
                            onChange={(e) => setEditedValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") saveEdit(index);
                                if (e.key === "Escape") cancelEdit();
                            }}
                            className="edit-input"
                            autoFocus
                        />
                        <button
                            onClick={() => saveEdit(index)}
                            className="save-btn"
                            aria-label="Save keyword"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => cancelEdit()}
                            className="cancel-btn"
                            aria-label="Cancel edit"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <>
                        <span
                            className="keyword-text"
                            onDoubleClick={() => startEditing(index, keyword)}
                            title="Double-click to edit"
                        >
                            {keyword}
                        </span>
                        <div className="keyword-actions">
                            <button
                                onClick={() => startEditing(index, keyword)}
                                className="edit-btn"
                                aria-label="Edit keyword"
                            >
                                ✏️
                            </button>
                            <button
                                onClick={() => {
                                    if (window.confirm("Are you sure you want to delete this keyword?")) {
                                        deleteKeyword(index);
                                    }
                                }}
                                className="delete-btn"
                                aria-label="Delete keyword"
                            >
                                🗑️
                            </button>
                        </div>
                    </>
                )}
            </li>
        );
    })

    return (
        <main>
            <form action={handleSubmit} className="keyword-form">
                <input
                    type="text"
                    placeholder=" eg. rain"
                    aria-label="keywords"
                    name="keywords"
                />
                <button>+ Add keyword</button>
            </form>

            {/* will be using conditional rendering here */}

            {keywords.length < 3 &&
                <section>
                    <h5 id="min-items-warning">please provide atleast 3 keywords!</h5>
                </section>
            }

            <section>
                {keywords.length > 0 && <h2 id="form-header">Current keywords</h2>}

                <ul id="keyword-list" > {keyword_list} </ul>

                {keywords.length >= 3 &&
                    <div className="get-keyword-container">
                        <div>
                            <h3>Ready for a joke?</h3>
                            <p>Generate a joke from your list of keywords.</p>
                        </div>
                        <button onClick={getJoke}>🎭 Get a Joke.</button>
                    </div>
                }

                {undoStack.length > 0 && (
                    <div className="undo-container">
                        <button onClick={handleUndo} className="undo-btn">
                            ↩️ Undo
                        </button>
                    </div>
                )}

            </section>

            {(isLoading || joke) && <JokeSection joke={joke} isLoading={isLoading} />}

        </main>
    )
}
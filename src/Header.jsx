import React from "react";

export default function Header() {
    const [showInfo, setShowInfo] = React.useState(false);

    return (
        <header>
            <img id="joker" src="/joker.png" alt="joker-dude-logo" />
            <h2 id="joker-text">Joke Dude</h2>
            <button
                id="info-button"
                onClick={() => setShowInfo(!showInfo)}
                aria-label="How to use this app"
            >
                ℹ️ How to Use
            </button>
            {showInfo && (
                <div id="info-modal">
                    <div id="info-content">
                        <button
                            id="close-info"
                            onClick={() => setShowInfo(false)}
                            aria-label="Close info"
                        >
                            ×
                        </button>
                        <h3>How to Use Joke Dude</h3>
                        <ol>
                            <li>
                                <strong>Add Keywords:</strong> Type keywords into the input field and click "+ Add keyword" or press Enter.
                            </li>
                            <li>
                                <strong>Manage Keywords:</strong> 
                                <ul>
                                    <li>Double-click to edit any keyword</li>
                                    <li>Click the 🗑️ button to delete</li>
                                    <li>Use ↩️ Undo to restore deleted/edited keywords</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Generate Jokes:</strong> Once you have at least 3 keywords, click the "🎭 Get a Joke" button to create a joke incorporating all your keywords.
                            </li>
                            <li>
                                <strong>Preview & Copy:</strong> The generated joke appears below as formatted Markdown. Click the text to copy it easily.
                            </li>
                        </ol>
                        <p><strong>Tip:</strong> Keywords can be in any order. The joke generator will weave them together in a funny way!</p>
                    </div>
                </div>
            )}
        </header>
    )
}
import { useState } from "react";

export default function AdminContentPage() {
    const [about, setAbout] = useState(
        "Exploring tokenization for transparent and equitable land compensation in Gelephu Mindfulness City."
    );
    const [faq, setFaq] = useState(
        "- What is this prototype?\nA demo to illustrate how land value could be tokenized.\n\n- Is this real money?\nNo. All numbers are fictional."
    );
    const [docUrl, setDocUrl] = useState(
        "https://example.com/gmc-token-concept-note.pdf"
    );

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Demo: content ‘saved’ (not persisted).");
    };

    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">
                    Content Management
                </h1>
                <p className="text-sm text-slate-500">
                    Manage About section, FAQ text, and document links used across the portal.
                </p>
            </div>

            {/* CONTENT FORM CARD */}
            <form
                onSubmit={handleSave}
                className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm space-y-6"
            >
                <h2 className="text-lg font-semibold text-slate-700">
                    Edit Portal Content
                </h2>

                {/* About Section */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-600">
                        About (Landing Page & Dashboard)
                    </label>
                    <textarea
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
                    />
                </div>

                {/* FAQ Section */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-600">
                        FAQ (Markdown / Plain Text)
                    </label>
                    <textarea
                        value={faq}
                        onChange={(e) => setFaq(e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
                    />
                    <p className="text-xs text-slate-400">
                        You can use Markdown-style formatting for lists, questions, and answers.
                    </p>
                </div>

                {/* Document URL */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-600">
                        Concept Note / Policy Brief URL
                    </label>
                    <input
                        value={docUrl}
                        onChange={(e) => setDocUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                    <p className="text-xs text-slate-400">
                        For demo purposes, this can be a placeholder PDF link.
                    </p>
                </div>

                {/* Save button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-5 py-2 bg-slate-900 text-white rounded-md text-sm font-medium shadow-sm hover:bg-slate-800 transition"
                    >
                        Save Content
                    </button>
                </div>
            </form>
        </div>
    );
}

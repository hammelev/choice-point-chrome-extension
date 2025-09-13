import useBlockedWebsites from "~/hooks/useBlockedWebsites";
import AddWebsiteForm from "./AddWebsiteForm";
import FeedbackMessage from "./FeedbackMessage";
import BlockedWebsitesList from "./BlockedWebsitesList";

export default function App() { 
    const { blockedWebsites, feedback, addWebsite, removeWebsite } = useBlockedWebsites();

    const handleRemoveBlockedWebsite = (urlToRemove: string, uuidToRemove: string) => {
        if (confirm(`Are you sure you want to remove "${urlToRemove}" from your blocked list?`)) {
            removeWebsite(uuidToRemove);
        }
    }

    return (
        <>
            <h1>Blocked Websites</h1>
            <AddWebsiteForm onAddWebsite={addWebsite} />
            <FeedbackMessage message={feedback} />
            <BlockedWebsitesList websites={blockedWebsites} onRemoveWebsite={handleRemoveBlockedWebsite} />
        </>
    )
}
import { Dialog, DialogContent, DialogHeader } from "@/Components/ui/dialog";
import { PersonForm } from "./PersonForm";


export default function PersonForm_Dialog({
    open,
    onOpenChange,
    domain,
    submitButtonText,
    triggerReload,
    personId,
    closeForm,
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>Person bearbeiten</DialogHeader>
                <div>
                    <PersonForm
                        domain={domain}
                        submitButtonText={submitButtonText}
                        triggerReload={triggerReload}
                        personId={personId}
                        closeForm={closeForm}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

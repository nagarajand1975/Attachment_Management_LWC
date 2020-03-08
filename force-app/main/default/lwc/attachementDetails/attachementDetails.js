import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { refreshApex } from '@salesforce/apex';
import searchAttachments from '@salesforce/apex/AttachmentController.searchAttachments';
import deleteAttachments from '@salesforce/apex/AttachmentController.deleteAttachments';

export default class AttachementDetails extends LightningElement {

    @api recordId;
    @api attachments;
    @track openModal;
    @api idToDelete;
    
    wiredAccountsResult;

    @wire(searchAttachments, { searchTerm: '$recordId' })
    loadAttachment(result) {
        this.wiredAccountsResult = result;
        if (result.data) {
            this.attachments = result.data;
            console.log(JSON.stringify(this.attachments));
        }
    }
    
    
    /**** Fires Popup Modal for Delete Confirmation */
    handlerClick(event){
        this.openModal = true;
        this.idToDelete = event.target.dataset.id;
        console.log("id::"+this.idToDelete);
    }

    /**** call to apex to remove attachment selected */
    deleteAction(){
        deleteAttachments({ searchTerm: this.idToDelete }) 
            .then((result) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Attachment was Deleted',
                        message: '',
                        variant: 'success'
                    })
                );
                console.log(result);
                this.closePopUp();
                return refreshApex(this.wiredAccountsResult);
            });
    }

    /**** call to apex to remove attachment selected */
    closePopUp() {
        this.openModal = false;
    }

    /** tried this to refresh the list in detail if navigate from related tab */
    connectedCallback() {
        return refreshApex(this.wiredAccountsResult)
    }
       

}
public with sharing class AttachmentController {

    @AuraEnabled(Cacheable=true)
    public static List<ContentDocumentLink> searchAttachments(String searchTerm) {
      
        List<ContentDocumentLink> Files = [SELECT Id,ContentDocumentId, LinkedEntityId,ContentDocument.title,Format(ContentDocument.CreatedDate),format(ContentDocument.LastModifiedDate), ContentDocument.LastModifiedBy.Name,ContentDocument.CreatedBy.Name  FROM ContentDocumentLink where 
                 LinkedEntityId = :searchTerm ];
         return Files;


    }


     @AuraEnabled
    public static Integer deleteAttachments(String searchTerm) {
      
        searchTerm = searchTerm.trim();
        string contentDocId;
        List<ContentDocumentLink> Files = [SELECT ContentDocumentId, LinkedEntityId,ContentDocument.title,format(ContentDocument.CreatedDate),format(ContentDocument.LastModifiedDate), ContentDocument.LastModifiedBy.Name,ContentDocument.CreatedBy.Name  FROM ContentDocumentLink where 
                 Id = :searchTerm ];
        for(ContentDocumentLink l:Files){
            contentDocId=l.ContentDocumentId; 
        }

         delete Files;

         /** Delete from content document */
         List<ContentDocument> doc = [SELECT Id, Title FROM ContentDocument where 
                 Id = :contentDocId ];
         delete doc;
         
         return 1;

    }

}

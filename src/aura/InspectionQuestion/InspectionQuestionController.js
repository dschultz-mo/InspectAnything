({
    doInit : function(component, event, helper) {
        //console.log("value is:")
        //console.log(component.get("v.question." + component.get("v.question.Response_Field__c")))
        component.set("v.localTextResponse", component.get("v.question." + component.get("v.question.Response_Field__c")));

        helper.setButtons(component);
        //sets the field describe for work order types
        component.set("v.actionFieldDescribe", _.find(component.get("v.actionDescribe").fields,  { "name": "TaskSubtype"}));
        
        helper.setPanelStyle(component);
        component.set("v.newAction", {});
    },
    
    setResponse: function (component, event, helper){        
        var params = {
            "recordId" : component.get("v.question.Id"),
            "fieldToUpdate" : component.get("v.question.Response_Field__c"),
            "fieldValue" : event.target.title
        }
        helper.setFieldAndUpdateLocalStuff(component, params);            
    },
    
    setTextResponse: function (component, event, helper){        
        var params = {
            "recordId" : component.get("v.question.Id"),
            "fieldToUpdate" : component.get("v.question.Response_Field__c"),
            "fieldValue" : component.get("v.localTextResponse")
        }
        helper.setFieldAndUpdateLocalStuff(component, params);        
    },
    
    setComment: function (component){
        var action = component.get("c.updateAnyStringField");
        action.setParams({
            "recordId" : component.get("v.question.Id"),
            "fieldToUpdate" : "Comments__c",
            "fieldValue" : component.get("v.question.Comments__c")
        });
        action.setCallback(this, function (a){
            //console.log(a.getReturnValue());                      
        });
        $A.enqueueAction(action);
    },
    
    showAction: function (component){
        component.set("v.action", true);
    },
    
    cancelAction: function (component){
        component.set("v.action", false);        
    },
    
    saveAction: function (component){  
        try{
            //public static task saveTaskFields (id questionId, id inspectionId, string subject){

            var action = component.get("c.saveTaskFields");
            
            action.setParams({
                "questionId" : component.get("v.question.Id"),
                "inspectionId" : component.get("v.question.Inspection__c"),
                "subject" : component.get("v.newAction.Subject")
            });
            
            action.setCallback(this, function (a){
                //console.log(a);
                component.set("v.action", false);
                component.set("v.newAction", {});            
            });
            
            $A.enqueueAction(action);
        } catch (err){
            console.log(err.message);
        }
    },
    
    navFeed: function (component){
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": component.get("v.question.Id"),
            "slideDevName": "chatter"
        });
        navEvt.fire();
    }
    
})
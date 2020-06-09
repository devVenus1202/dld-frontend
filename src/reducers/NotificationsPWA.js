/**
 * ErrorHandlerHelper Class - For managing errors
 */

let instanceNotificationsPWA = false;
//PWA
class NotificationsPWA {
    
    messages = [];
    
    constructor(err) {
        this.rawError = err;
        this.setError();
    }
    
    setMessages = (data) => {
        this.messages.push(data)
    };
    
    getMessages = () => {
        return this.messages
    };
    
    static getInstance()
    {
        if (!instanceNotificationsPWA){
            instanceNotificationsPWA = new NotificationsPWA()
        }
        
        return instanceNotificationsPWA
    }
}

export default NotificationsPWA.getInstance()


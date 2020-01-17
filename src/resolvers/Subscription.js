const Subscription = {
    userSubscription: {
        subscribe(parent, args, ctx, info){
            const { userID } = args;
            const { pubsub } = ctx;
            
            return pubsub.asyncIterator(userID);
        }
    }
}

export {Subscription as default}
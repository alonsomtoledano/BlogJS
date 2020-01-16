const Subscription = {
    postSubscription: {
        subscribe(parent, args, ctx, info){
            const { postID } = args;
            const { pubsub } = ctx;
            return pubsub.asyncIterator(postID);
        }
    },
    userSubscription: {
        subscribe(parent, args, ctx, info){
            const { userID } = args;
            const { pubsub } = ctx;
            return pubsub.asyncIterator(userID);
        }
    },
    newUserSubscription: {
        subscribe(parent, args, ctx, info){
            const { pubsub } = ctx;
            return pubsub.asyncIterator("12345");
        }
    }
}

export {Subscription as default}
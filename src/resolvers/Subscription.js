const Subscription = {
    MatchSubscription: {
        subscribe(parent, args, ctx, info){
            const { match } = args;
            const { pubsub } = ctx;
            return pubsub.asyncIterator(match);
        }
    },
    TeamSubscription: {
        subscribe(parent, args, ctx, info){
            const { team } = args;
            const { pubsub } = ctx;
            return pubsub.asyncIterator(team);
        }
    },
}

export {Subscription as default}
import React, { useEffect } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { useStore } from '../../../app/stores/store';
import { observer, useLocalObservable } from 'mobx-react-lite';
import ActivityFilters from './ActivityFilters';
import { PagingParams } from '../../../app/models/pagination';
import InfiniteScroll from 'react-infinite-scroller';
import { runInAction } from 'mobx';
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';

// For debugging mobx events 
// (loadingNext was being rendered once as false after setting to true, then rendered as true)
// function useTraceUpdate(props?: any) {
//     const prev = useRef(props);
//     useEffect(() => {
//         const changedProps = Object.entries(props).reduce((ps: any, [k, v]) => {
//             if (prev.current[k] !== v) {
//                 ps[k] = [prev.current[k], v];
//             }
//             return ps;
//         }, {});
//         if (Object.keys(changedProps).length > 0) {
//             console.log('Changed props:', changedProps);
//         }
//         prev.current = props;
//     });
// };

// spy(event => {
//     if (event.type === "action") {
//         console.log(`${event.name} with args: ${event.arguments}`)
//     }
// });

export default observer(function ActivityDashboard() {

    const { activityStore } = useStore();
    const { loadActivities, activityMap, setPagingParams, pagination } = activityStore;
    const loading = useLocalObservable(() => ({ next: false }));

    useEffect(() => {
        if (activityMap.size <= 1 && !activityStore.loadingInitial)
            loadActivities();
    }, [activityMap.size, loadActivities, activityStore.loadingInitial])

    function handleGetNext() {
        // console.log('handleGetNext() called. loadingNext = ' + loading.next);
        runInAction(() => {

            loading.next = true;
            // console.log('handleGetNext() -> setLoadingNext(true)');


            setPagingParams(new PagingParams(pagination!.currentPage + 1));
            // console.log('handleGetNext() -> loadActivities');

            loadActivities().then(() => runInAction(() => {
                // console.log('loadActivities.then -> setLoadingNext(false)');
                loading.next = false;
            }));
        });
    }

    //if (activityStore.loadingInitial && !loading.next) return <LoadingComponent content='Loading activities..' />


    return (

        <Grid>
            <Grid.Column width="10">
                {activityStore.loadingInitial && !loading.next ? (
                    <>
                        <ActivityListItemPlaceholder />
                        <ActivityListItemPlaceholder />
                    </>

                ) : (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={handleGetNext}
                        hasMore={!loading.next && !!pagination && pagination?.currentPage < pagination?.totalPages}
                        initialLoad={false}
                    >
                        <ActivityList />
                    </InfiniteScroll>
                )}

                {/* <Button
                    floated='right'
                    content='More...'
                    positive
                    onClick={handleGetNext}
                    loading={loading.next}
                    disabled={pagination?.totalPages === pagination?.currentPage}
                /> */}

            </Grid.Column>
            <Grid.Column width="6">
                <ActivityFilters />
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loading.next} />
            </Grid.Column>
        </Grid>


    );
});
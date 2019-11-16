import React, {useEffect, useState} from 'react';
import {View, TextInput, StyleSheet, Text} from "react-native";
import {BehaviorSubject, combineLatest, timer} from "rxjs";
import {debounce, filter, flatMap, tap, map} from "rxjs/operators";
import { getLogger, apiUrl, getToken } from '../../core';
import axios from 'axios';

const log = getLogger('Search');

const withObservable = (observable, triggers, initialState, onChangeState) => Component => {
    const [state, setState] = useState(initialState);
    useEffect(() => {
        log('Effect - created');
        const subscription = observable.subscribe(value => {
            value.query !== '' ? onChangeState([...value.tasks]) : onChangeState([], false);
            setState({...value});
        });
        return () => {
            log('Effect - destroyed');
            subscription.unsubscribe();
        };
    },[]);
    log('Observable render...')
    return (
        <Component {...triggers} {...state} />
    );
};

const Search = ({onChangeQuery, onChangeSize, query, size}) => {
    log("render...");
    return (
        <View>
            <Text>Search: </Text>
            <TextInput onChangeText={onChangeQuery} placeholder="Title" value={query} style={styles.input}/>
            <TextInput onChangeText={onChangeSize} placeholder="Size" value={size} style={styles.input}/>
        </View>
    );
};

const query$ = new BehaviorSubject('');
const size$ = new BehaviorSubject('10');

const queryForFetch$ = query$.pipe(
    //debounce(() => timer(1000)),
    filter(query => query !== ''),
);

const fetch$ = combineLatest([size$, queryForFetch$]).pipe(
    tap(value => log('fetch$ pipe', value) ),
    flatMap(([size, query]) =>
        axios(`${apiUrl}/tasks/search?title=${query}&size=${size}`,{ headers:{'Authorization': 'Bearer '+getToken()}}),
    ),
    map(result => result.data),
);

export default ({onChangeState}) => withObservable(
    combineLatest([size$, query$, fetch$]).pipe(
        tap(({size, query}) => log('combine latest', size, query)),
        map(([size, query, tasks]) => ({size, query, tasks}))
    ),
    {
        onChangeSize: value => size$.next(value),
        onChangeQuery: value => query$.next(value),
    },{
        query: '',
        size: '10',
        tasks: [],
    },
     onChangeState
)(Search);

const styles = StyleSheet.create({
    input: {
        marginLeft: 20,
        marginTop: 0,
        marginBottom: 0,
        padding: 0,
    },
});



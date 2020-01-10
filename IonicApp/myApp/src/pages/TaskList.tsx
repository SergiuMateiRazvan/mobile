import React from "react";
import {Consumer} from './context';
import {
    IonButton,
    IonContent, IonFab,
    IonHeader, IonItem, IonLabel,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {TaskItem} from "./components/TaskItem";

export const TaskList: React.FC = () => {

    return (
        <Consumer>
            {({state, title, onDelete}) => (
                <IonPage>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>{title}</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <IonItem>
                            <IonLabel>Titlu</IonLabel>
                            <IonLabel>Descriere</IonLabel>
                            <IonLabel>Deadline</IonLabel>
                            <IonLabel>Status</IonLabel>
                        </IonItem>
                        <IonList>
                            {state && state.tasks && state.tasks.map(task => (
                                <TaskItem key={task.ID} task={task} onDelete={onDelete}/>
                            ))}
                        </IonList>
                        <IonFab horizontal="end" vertical="bottom">
                            <IonButton routerLink="/edit">ADD</IonButton>
                        </IonFab>
                    </IonContent>
                </IonPage>
            )}
        </Consumer>
    )
};

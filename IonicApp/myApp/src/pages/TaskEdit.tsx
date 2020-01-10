import React, {Props, useState} from "react";
import {
    IonContent, IonHeader, IonBackButton,
    IonPage, IonTitle, IonToolbar, IonButtons, IonInput, IonSelect, IonSelectOption, IonButton
} from "@ionic/react";
import {Consumer} from './context';
import {Task} from "../Model/task";

const initialState: Task = {
    Title: '', Description: "", Deadline: 0, Status: 'To Do'
};

export const TaskEdit: React.FC<any> = ({history}) => {
    const [task, setTask] = useState<Task>(initialState);
    // @ts-ignore
    // @ts-ignore
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton/>
                    </IonButtons>
                    <IonTitle>Edit</IonTitle>
                </IonToolbar>
            </IonHeader>
            <Consumer>
                {({onSubmit}) => (
                    <IonContent>
                        <IonInput placeholder="Title" required onIonChange={e => {
                            task.Title = e.detail.value || '';
                            setTask(task);
                        }}/>
                        <IonInput placeholder="Description" required onIonChange={e => {
                            task.Description = e.detail.value || '';
                            setTask(task);
                        }}/>
                        <IonInput placeholder="Deadline" type="number" required onIonChange={e => {
                            const value = e.detail.value || '';
                            task.Deadline = parseInt(value);
                            setTask(task);
                        }}/>
                        <IonSelect placeholder="Status" onIonChange={e=>{
                            task.Status = e.detail.value || '';
                            setTask(task);
                        }}>
                            <IonSelectOption value="To Do">To Do</IonSelectOption>
                            <IonSelectOption value="In Progress">In Progress</IonSelectOption>
                            <IonSelectOption value="Done">Done</IonSelectOption>
                        </IonSelect>
                        <IonButton style={{"marginLeft": "40%"}} onClick={() => {
                            // @ts-ignore
                            onSubmit(task).then(response => {history.push('/home')})
                        }}>Submit</IonButton>
                    </IonContent>
                )}
            </Consumer>
        </IonPage>
    )
};

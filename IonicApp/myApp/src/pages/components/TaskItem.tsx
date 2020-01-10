import {IonIcon, IonItem, IonLabel} from "@ionic/react";
import React, {ComponentProps} from "react";

export const TaskItem: React.FC<ComponentProps<any>> = ({task, onDelete}) => {
    return (
        <IonItem key={task.ID}>
            <IonLabel>{task.Title}</IonLabel>
            <IonLabel>{task.Description}</IonLabel>
            <IonLabel>{task.Deadline}</IonLabel>
            <IonLabel>{task.Status}</IonLabel>
            <IonIcon name="close-circle" onClick={() => onDelete(task.ID)}></IonIcon>
        </IonItem>
    )
};

import { useReducer, useEffect, useState } from "react";
import { projectFirestore, timestamp } from "../firebase/config";
import "firebase/firestore";
// import firebase from "firebase/app";

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
};

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case "IS_PENDING":
      return { isPending: true, document: null, success: false, error: null };
    case "ADDED_DOCUMENT":
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "UPDATED_DOCUMENT":
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "DELETED_DOCUMENT":
      return { isPending: false, document: null, success: true, error: null };
    case "ERROR":
      return {
        isPending: false,
        document: null,
        success: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const useFirestore = (collection) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);

  // collection ref
  const ref = projectFirestore.collection(collection);

  // only dispatch is not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  // add a document
  const addDocument = async (doc) => {
    dispatch({ type: "IS_PENDING" });

    try {
      const createdAt = timestamp.fromDate(new Date());
      const addedDocument = await ref.add({ ...doc, createdAt });
      dispatchIfNotCancelled({
        type: "ADDED_DOCUMENT",
        payload: addedDocument,
      });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
    }
  };

  // update documents
  const updateDocument = async (id, updateDoc) => {
    dispatch({ type: "IS_PENDING" });
    try {
      // const updatedDocument = await ref.doc(id).update(updateDoc)
      const updatedDocument = await ref.doc(id).update(updateDoc);
      dispatchIfNotCancelled({
        type: "UPDATED_DOCUMENT",
        payload: updatedDocument,
      });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
      console.log(err.message);
    }
  };

  // Temporary function
  // set arrey in documents for taskLibrary

  // const updateArrDocument = async (id, updateDoc) => {
  //   dispatch({ type: 'IS_PENDING' })

  //   try{
  //     const updatedDocument = await ref.doc(id).set(updateDoc)

  //     dispatchIfNotCancelled({ type: 'UPDATED_DOCUMENT', payload: updatedDocument })
  //   }
  //   catch (err) {
  //     dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
  //   }
  // }
  //Update task status
  // const updateTaskInDocument = async (id, stageKey, index, calculatedamount, status) => {
  //   dispatch({ type: 'IS_PENDING' })
  //   console.log('Firebase index', index)
  //   console.log('Firebase culatedamount', calculatedamount)
  //   console.log('Firebase status', status)
  //   // console.log('Firebase', reStages)
  //   // const updateMainlist = { mainList: reStages}
  //   const nestedField = `mainList.${stageKey}.tasks.${index}.status`
  //   const updateObj = {}
  //   updateObj[nestedField] = firebase.firestore.FieldValue.set(status)

  //   try{
  //     // const updatedDocument = await ref.doc(id).set({
  //     const updatedDocument = await ref.doc(id).update({
  //       [nestedField]: firebase.firestore.FieldValue.set(status)
  //     })
  //       // name: project.name,
  //       // clientName: project.clientName,
  //       // phone: project.phone,
  //       // email: project.email,
  //       // address: project.address,
  //       // `mainList.${stageKey}.tasks.${index}.calculatedamount` : calculatedamount,
  //       // ["mainList." + stageKey + ".tasks." + index + ".status"] : status,

  //       // labourList: project.labourList,
  //       // startDate: project.startDate,
  //       // createdAt: project.createdAt,
  //       // GSTno: project.GSTno,
  //       // subContractFee: project.subContractFee,
  //       // description: project.description,
  //       // team: project.team,
  //       // projectStatus: project.projectStatus

  //     dispatchIfNotCancelled({ type: 'UPDATED_DOCUMENT', payload: updatedDocument })
  //     console.log('works')
  //   }
  //   catch (err) {
  //     dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
  //     console.log(err.message)
  //   }
  // }

  // delete a document
  const deleteDocument = async (id) => {
    dispatch({ type: "IS_PENDING" });

    try {
      await ref.doc(id).delete();
      dispatchIfNotCancelled({ type: "DELETED_DOCUMENT" });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: "could not delete" });
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { addDocument, updateDocument, deleteDocument, response };
};

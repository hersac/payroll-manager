import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, getDocs, orderBy, query, deleteDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential, verifyBeforeUpdateEmail, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD8eoo2v11ZJhbDJL3k4-bGvWTB4-4ChFI",
  authDomain: "pyroll-3ad83.firebaseapp.com",
  projectId: "pyroll-3ad83",
  storageBucket: "pyroll-3ad83.appspot.com",
  messagingSenderId: "699041480713",
  appId: "1:699041480713:web:de35644532d21f809cb8d8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app, "gs://pyroll-3ad83.appspot.com");
const db = getFirestore(app);

const createUser = async (auth, email, password) => {
  await createUserWithEmailAndPassword(auth, email, password);
};

const loginUser = async (auth, email, password) => {
  await signInWithEmailAndPassword(auth, email, password);
};

const changeUser = async (dataUser) => {
  await updateProfile(auth.currentUser, dataUser);
};

const changeEmail = async (newEmail,password)=>{
  const user = auth.currentUser;
  await reauthenticate(password)
  await verifyBeforeUpdateEmail(user, newEmail)
  .then(async ()=>{
    await updateEmail(user, newEmail);
  })
  .catch(err=>console.log(err))
  .finally(()=>{
    signOut(auth);
  });
};

const changePassword = async (password, newPassword) => {
  const user = auth.currentUser;
  await reauthenticate(password);
  await updatePassword(user, newPassword)
  signOut(auth);
};

const reauthenticate = async (password) => {
  const user = auth.currentUser;
  const credentials = EmailAuthProvider.credential(
      user.email,
      password
  );
  await reauthenticateWithCredential(user, credentials);
}

const getNominas = async () => {
  const nominasRef = collection(db, auth.currentUser.uid);
  const queryNomina = query(nominasRef, orderBy("date", "desc"));
  const datos = await getDocs(queryNomina);
  const result = [];
  datos.docs.forEach((doc)=>{
    const data = doc.data();
    data.id = doc.id;
    result.push(data)
  });
  return result;

};

const deleteNomina = async (id) => {
  const nominasRef = collection(db, auth.currentUser.uid);
  const datos = await getDocs(nominasRef);

  datos.docs.forEach(async (doc)=>{
    if(doc.id === id){
      await deleteDoc(doc.ref);
    }
  });
  
}

const nominaUpload = async (nameFile, file, date) => {
  const fileRef = ref(storage, `${auth.currentUser.uid}/${nameFile}.pdf`);
  await uploadBytes(fileRef, file);
  const payrollUrl = await getDownloadURL(fileRef);
  const collectionModel = collection(db, auth.currentUser.uid);
  await addDoc(collectionModel, {
    payrollUrl,
    date: new Date(date),
    dateString: date,
  });
};

export { auth, createUser, loginUser, changeUser, changeEmail, changePassword, getNominas, nominaUpload, deleteNomina };
// import { writable } from "svelte/store";
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { firebaseConfig } from './firebase.config';
import {
	getFirestore,
	collection,
	addDoc,
	getDoc,
	doc,
	updateDoc,
	deleteDoc
} from 'firebase/firestore';
import {
	deleteObject,
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable
} from 'firebase/storage';

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

// Pengaturan session feedback success atau error
export const getUser = () => {
	const user = auth.currentUser;
	// if (user !== null) {
	// // The user object has basic properties such as display name, email, etc.
	// const displayName = user.displayName;
	// const email = user.email;
	// const photoURL = user.photoURL;
	// const emailVerified = user.emailVerified;

	// // The user's ID, unique to the Firebase project. Do NOT use
	// // this value to authenticate with your backend server, if
	// // you have one. Use User.getToken() instead.
	// const uid = user.uid;
	// }
	// console.log(user);
	return user;
};

export const logout = () => {
	signOut(auth)
		.then(() => {
			// Sign-out successful.
		})
		.catch((error) => {
			// An error happened.
			console.log(error);
		});
};

import type { dataPelanggan } from 'src/interfaces/Customer';

export const addCustomer = async (data: dataPelanggan) => {
	// console.log(data);
	try {
		const docRef = await addDoc(collection(db, 'customers'), {
			nama: data.nama,
			gender: data.gender,
			phone: data.phone,
			email: data.email,
			alamat: {
				baris_1: data.alamat.baris_1,
				baris_2: data.alamat.baris_2,
				provinsi: data.alamat.provinsi,
				kota: data.alamat.kota,
				kodepos: data.alamat.kodepos
			},
			photo: data.photo,
			photo_link: data.photo_link,
			desc: data.desc,
			user_id: data.user_id
		});
		console.log('Document written with ID: ', docRef.id);
		return docRef.id;
	} catch (e) {
		console.error('Error adding document: ', e);
	}
};

// Upload Profile Picture disini
export const uploadImageToFirebaseStorage = async (
	file: any,
	path_and_name: string,
	updateFirestore: boolean,
	id: string,
	filename: string
) => {
	// Create the file metadata
	/** @type {any} */
	const metadata = {
		contentType: 'image/jpeg'
	};

	// Upload file and metadata to the object 'images/mountains.jpg'

	const storageRef = ref(storage, path_and_name);
	const uploadTask = uploadBytesResumable(storageRef, file, metadata);

	// Listen for state changes, errors, and completion of the upload.
	uploadTask.on(
		'state_changed',
		(snapshot) => {
			// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
			const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			console.log('Upload is ' + progress + '% done');
			switch (snapshot.state) {
				case 'paused':
					console.log('Upload is paused');
					break;
				case 'running':
					console.log('Upload is running');
					break;
			}
		},
		(error) => {
			// A full list of error codes is available at
			// https://firebase.google.com/docs/storage/web/handle-errors
			switch (error.code) {
				case 'storage/unauthorized':
					// User doesn't have permission to access the object
					break;
				case 'storage/canceled':
					// User canceled the upload
					break;

				// ...

				case 'storage/unknown':
					// Unknown error occurred, inspect error.serverResponse
					break;
			}
		},
		() => {
			// Upload completed successfully, now we can get the download URL
			getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
				console.log('File available at', downloadURL);
				if (updateFirestore) {
					updateCustomerPhoto(id, filename, downloadURL);
				}
			});
		}
	);
};

export const updateCustomerPhoto = async (id: string, filename: string, imageurl: any) => {
	const customerRef = doc(db, 'customers', id);

	await updateDoc(customerRef, {
		photo: filename,
		photo_link: imageurl
	});
	// return ' Profile Picture pelanggan ini telah diupdate!';
};

export const getCustomerFromFirestore = async (id: string) => {
	const docRef = doc(db, 'customers', id);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		// console.log('Document data:', docSnap.data());
		return docSnap.data();
	} else {
		// doc.data() will be undefined in this case
		// console.log('No such document!');
		return false;
	}
};

export const deleteDocumentFromFirestore = async (collection: string, id: string) => {
	const result = await deleteDoc(doc(db, collection, id)).then(() => {
		return `Data pada ${collection} dengan id: ${id} telah berhasil dihapus!`;
	});
	return result;
};

export const deleteFileFromStorage = async (file_path: string) => {
	// Create a reference to the file to delete
	const desertRef = ref(storage, file_path);

	// Delete the file
	const result = await deleteObject(desertRef)
		.then(() => {
			// File deleted successfully
			return 'File pada storage berhasil dihapus!';
		})
		.catch((error) => {
			// Uh-oh, an error occurred!
			console.log(error);
		});
	return result;
};

export const admin_ids = ['B5hrh2ZsjZTTsv2LpH7T15116fG3'];

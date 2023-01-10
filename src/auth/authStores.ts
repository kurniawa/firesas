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
	deleteDoc,
	Timestamp
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
const not_allowed_chars = '!`$%^&*()=[];/{}|:<>?';
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
			username: data.username,
			gender: data.gender,
			tanggal_lahir: data.tanggal_lahir,
			phone: data.phone,
			email: data.email,
			alamat: {
				baris_1: data.alamat.baris_1,
				baris_2: data.alamat.baris_2,
				provinsi: data.alamat.provinsi,
				kota: data.alamat.kota,
				kodepos: data.alamat.kodepos,
				daerah: data.alamat.daerah
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
	fieldName: string,
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
					if (fieldName==='photo') {
						updateCustomerPhoto(id, filename, downloadURL);
						
					} else if (fieldName==='photo_id') {
						updateCustomerPhotoID(id, filename, downloadURL);
						
					}

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
};

export const updateCustomerPhotoID = async (id: string, filename: string, imageurl: any) => {
	const customerRef = doc(db, 'customers', id);

	await updateDoc(customerRef, {
		photo_id: filename,
		photo_id_link: imageurl
	});
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

export const updateUsernameOfCustomer = async (id: string, username: string) => {
	const customerRef = doc(db, 'customers', id);
	// console.log('customerRef:');
	// console.log(customerRef);
	// console.log('id:');
	// console.log(id);
	for (let i = 0; i < username.length; i++) {
		if (not_allowed_chars.indexOf(username.charAt(i)) != -1) {
			return { updating: 'username', status: 400, message: 'Invalid Username!' };
		}
	}
	const res = await updateDoc(customerRef, {
		username: username
	})
		.then(() => {
			return { updating: 'username', status: 200, message: 'Username berhasil diupdate!' };
		})
		.catch((err) => {
			console.log(err);
			return {
				updating: 'username',
				status: 400,
				message: 'Terdapat error pada proses update username!'
			};
		});

	return res;
	// return ' Profile Picture pelanggan ini telah diupdate!';
};

export const updateDataOfCustomer = async (
	id: string,
	nama: string,
	gender: string,
	tanggal_lahir: string,
	email: string,
	phone: string,
	alamat_baris_1: string,
	alamat_baris_2: string,
	kota: string,
	provinsi: string,
	kodepos: string,
	daerah: string,
	desc: string
) => {
	const customerRef = doc(db, 'customers', id);
	// console.log('customerRef:');
	// console.log(customerRef);
	// console.log('id:');
	// console.log(id);
	// console.log(tanggal_lahir);
	// console.log(daerah);
	// return { updating: 'data_user', status: 400, message: 'test return' };
	for (let i = 0; i < nama.length; i++) {
		if (not_allowed_chars.indexOf(nama.charAt(i)) != -1) {
			return { updating: 'data_user', status: 400, message: 'Invalid nama!' };
		}
	}
	for (let i = 0; i < email.length; i++) {
		if (not_allowed_chars.indexOf(email.charAt(i)) != -1) {
			return { updating: 'data_user', status: 400, message: 'Invalid email!' };
		}
	}
	for (let i = 0; i < phone.length; i++) {
		if (not_allowed_chars.indexOf(phone.charAt(i)) != -1) {
			return { updating: 'data_user', status: 400, message: 'Invalid phone!' };
		}
	}
	for (let i = 0; i < alamat_baris_1.length; i++) {
		if (not_allowed_chars.indexOf(alamat_baris_1.charAt(i)) != -1) {
			return { updating: 'data_user', status: 400, message: 'Invalid alamat!' };
		}
	}
	for (let i = 0; i < alamat_baris_2.length; i++) {
		if (not_allowed_chars.indexOf(alamat_baris_2.charAt(i)) != -1) {
			return { updating: 'data_user', status: 400, message: 'Invalid alamat!' };
		}
	}
	for (let i = 0; i < kota.length; i++) {
		if (not_allowed_chars.indexOf(kota.charAt(i)) != -1) {
			return { updating: 'data_user', status: 400, message: 'Invalid alamat!' };
		}
	}
	for (let i = 0; i < provinsi.length; i++) {
		if (not_allowed_chars.indexOf(provinsi.charAt(i)) != -1) {
			return { updating: 'data_user', status: 400, message: 'Invalid alamat!' };
		}
	}
	for (let i = 0; i < kodepos.length; i++) {
		if (not_allowed_chars.indexOf(kodepos.charAt(i)) != -1) {
			return { updating: 'data_user', status: 400, message: 'Invalid alamat!' };
		}
	}
	for (let i = 0; i < daerah.length; i++) {
		if (not_allowed_chars.indexOf(daerah.charAt(i)) != -1) {
			return { updating: 'data_user', status: 400, message: 'Invalid alamat!' };
		}
	}
	for (let i = 0; i < desc.length; i++) {
		if (not_allowed_chars.indexOf(desc.charAt(i)) != -1) {
			return { updating: 'data_user', status: 400, message: 'Invalid description!' };
		}
	}
	const res = await updateDoc(customerRef, {
		gender: gender,
		tanggal_lahir: new Date(tanggal_lahir),
		email: email,
		phone: phone,
		alamat: {
			baris_1: alamat_baris_1,
			baris_2: alamat_baris_2,
			kota: kota,
			provinsi: provinsi,
			daerah: daerah,
			kodepos: kodepos
		},
		desc: desc
	})
		.then(() => {
			return { updating: 'data_user', status: 200, message: 'Data user berhasil diupdate!' };
		})
		.catch((err) => {
			console.log(err);
			return {
				updating: 'data_user',
				status: 400,
				message: 'Terdapat error pada proses update data_user!'
			};
		});

	return res;
	// return ' Profile Picture pelanggan ini telah diupdate!';
};

export const admin_ids = ['B5hrh2ZsjZTTsv2LpH7T15116fG3'];

class Usuario {
    nombre: any; 
    apPaterno: any;
    email: any;  
    image: any; 
    /* constructor(nombre: any, apPaterno: any, email: any, image: any){
        this.nombre = nombre;
        this.apPaterno = apPaterno;
        this.email = email;
        this.image = image
    } */
}

/* const usuarioConverter = {
    toFirestore: (user: any) => {
        return {
            nombre: user.nombre,
            apPaterno: user.apPaterno,
            email: user.email, 
            password: user.password, 
            image: user.image,
            status: user.status,
        };
    },
    fromFirestore: (snapshot: any, options:any) => {
        const data = snapshot.data(options);
        return new Usuario(data.nombre, data.apPaterno, data.email, data.image)
    }
} */

export { Usuario }
import React, { useEffect, useRef, useState } from 'react';
import {
    IonButton,
    IonModal,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonPage,
    IonList,
    IonItem,
    IonLabel,
    IonAvatar,
    IonImg,
    IonSearchbar,
    IonGrid,
    IonRow,
    IonCol,
} from '@ionic/react';
import { IonInput } from '@ionic/react';
import { IonInputPasswordToggle } from '@ionic/react';
import jwtAuthAxios, { setAuthToken } from "../service/jwtAuth";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

const Login = ({ handleClosep }) => {

    const [input, setInput] = useState({
        name: "",
        email: "",
        mobileNo: "",
        password: "",
        company: "",
        refrence: ""
    });
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        setLoading(true);

        console.log(input)

        try {
            if (isLogin) {
                const response = await jwtAuthAxios.post("client/auth", {
                    name: input.name,
                    password: input.password,
                });
                if (response.status === 200) {
                    setAuthToken(response?.data);
                    localStorage.setItem("token", response?.data?.token);
                    localStorage.setItem("user", JSON.stringify(response?.data?.data));
                    jwtAuthAxios.defaults.headers.common["Authorization"] =
                        "Bearer " + response?.data?.token;
                    toast.success(response?.data?.message);
                    history.push("/");
                    window.location.href = '/';
                    handleClosep();

                }
            } else {
                const response = await jwtAuthAxios.post("client/register", input);
                if (response.status === 200) {

                    setInput({
                        name: input.name,
                        password: input.password,
                    });
                    setIsLogin(true);
                }
            }
        } catch (error) {
            console.error(error?.response?.data || "Invalid ");

        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        console.log('sdsd')
        const { name, value } = e.target;
        setInput((prevInput) => ({ ...prevInput, [name]: value }));
    };


    useEffect(() => {
        console.log('input', input)
    }, [input])


    return (
        <>
            <IonPage>
                <div className='main-bg' style={{ width: '100%', height: '100%' }}>
                    <div style={{ width: '100%', height: '30px', background: '#4c3226', position: 'absolute', left: ' 0', top: '0' }}></div>
                    <img
                        className='freemlogin1'
                        src="src/img/freemlogin.png"
                    ></img>
                    <div className='user-img'>
                        <IonImg
                            className='freemlogin2'
                            src="src/img/userlogo.svg"
                        ></IonImg>
                        <div class="cell smaldesignleft">
                            <div class="circle fade-in-left">
                                <img
                                    src="src/img/leftdesign.svg"
                                ></img>
                            </div>
                        </div>
                        <div class="cell smaldesignright">
                            <div class="circle fade-in-left">
                                <img
                                    src="src/img/rightdesign.svg"
                                ></img>
                            </div>
                        </div>

                    </div>
                    <IonGrid>
                        <IonRow>
                            <IonCol>
                                <form className='form-details' color='secondary' onSubmit={handleSubmit}>
                                    {isLogin ? (
                                        <>
                                            <div style={{ display: 'flex' }}>
                                                <IonInput
                                                    name="name"
                                                    placeholder="Enter Username"
                                                    color='secondary'
                                                    style={{ background: '#FFDEB3', color: '#000' }}
                                                    slot="start"
                                                    value={input.name}
                                                    onIonChange={handleChange}
                                                    required
                                                    fill="clear"
                                                >
                                                    <ion-icon style={{ marginLeft: '15px', marginRight: '27px' }} color='secondary' slot="start" name="person"></ion-icon>
                                                </IonInput>
                                            </div>
                                            <div style={{ display: 'flex' }}>
                                                <IonInput
                                                    name='password'
                                                    type="password"
                                                    color='secondary'
                                                    placeholder="Enter Password"
                                                    fill="clear"
                                                    style={{ background: '#FFDEB3', color: '#000' }}
                                                    slot="start"
                                                    value={input.password}
                                                    onIonChange={handleChange}
                                                    required
                                                >
                                                    <IonInputPasswordToggle style={{ padding: '0' }} slot="start" fill='clear' color='secondary'></IonInputPasswordToggle>
                                                </IonInput>
                                            </div>
                                            <IonButton
                                                color='secondary'
                                                type='submit'
                                                expand="full"
                                                style={{ marginTop: '20px', width: '95%', textTransform: 'capitalize' }}
                                                disabled={loading}
                                            >
                                                {loading ? 'Logging in...' : 'Login'}
                                            </IonButton>
                                        </>
                                    ) : (
                                        <>
                                            <div style={{ display: 'flex' }}>
                                                <IonInput
                                                    name="name"
                                                    placeholder="Enter Username"
                                                    color='secondary'
                                                    style={{ background: '#FFDEB3', color: '#000' }}
                                                    slot="start"
                                                    value={input.name}
                                                    onIonChange={handleChange}
                                                    required
                                                    fill="clear"
                                                >
                                                    <ion-icon style={{ marginLeft: '15px', marginRight: '27px' }} color='secondary' slot="start" name="person"></ion-icon>
                                                </IonInput>
                                            </div>
                                            <div style={{ display: 'flex' }}>
                                                <IonInput
                                                    name="email"
                                                    type="email"
                                                    placeholder="Enter Email"
                                                    color='secondary'
                                                    style={{ background: '#FFDEB3', color: '#000' }}
                                                    slot="start"
                                                    value={input.email || ''}
                                                    onIonChange={handleChange}
                                                    required
                                                    fill="clear"
                                                >
                                                    <ion-icon style={{ marginLeft: '15px', marginRight: '27px' }} color='secondary' slot="start" name="mail"></ion-icon>
                                                </IonInput>
                                            </div>
                                            <div style={{ display: 'flex' }}>
                                                <IonInput
                                                    name='mobileNo'
                                                    type="tel"
                                                    placeholder="Enter Mobile NO"
                                                    color='secondary'
                                                    style={{ background: '#FFDEB3', color: '#000' }}
                                                    slot="start"
                                                    value={input.mobileNo || ''}
                                                    onIonChange={handleChange}
                                                    required
                                                    fill="clear"
                                                >
                                                    <ion-icon style={{ marginLeft: '15px', marginRight: '27px' }} color='secondary' slot="start" name="call"></ion-icon>
                                                </IonInput>
                                            </div>
                                            <div style={{ display: 'flex' }}>
                                                <IonInput
                                                    name='company'
                                                    placeholder="Enter Business Name"
                                                    color='secondary'
                                                    style={{ background: '#FFDEB3', color: '#000' }}
                                                    slot="start"
                                                    value={input.company || ''}
                                                    onIonChange={handleChange}
                                                >
                                                    <ion-icon style={{ marginLeft: '15px', marginRight: '27px' }} color='secondary' slot="start" name="business"></ion-icon>
                                                </IonInput>
                                            </div>
                                            <div style={{ display: 'flex' }}>
                                                <IonInput
                                                    name='refrence'
                                                    placeholder="Enter Refrence Name"
                                                    color='secondary'
                                                    style={{ background: '#FFDEB3', color: '#000' }}
                                                    slot="start"
                                                    value={input.refrence || ''}
                                                    onIonChange={handleChange}
                                                >
                                                    <ion-icon style={{ marginLeft: '15px', marginRight: '27px' }} color='secondary' slot="start" name="person-add"></ion-icon>
                                                </IonInput>
                                            </div>
                                            <div style={{ display: 'flex' }}>
                                                <IonInput
                                                    name='password'
                                                    type="password"
                                                    color='secondary'
                                                    placeholder="Enter Password"
                                                    fill="clear"
                                                    style={{ background: '#FFDEB3', color: '#000' }}
                                                    slot="start"
                                                    value={input.password}
                                                    onIonChange={handleChange}
                                                    required
                                                >
                                                    <IonInputPasswordToggle style={{ padding: '0' }} slot="start" fill='clear' color='secondary'></IonInputPasswordToggle>
                                                </IonInput>
                                            </div>

                                            <IonButton color='secondary' type='submit' expand="full" style={{ marginTop: '20px', width: '95%', textTransform: 'capitalize' }}>Register</IonButton>
                                        </>
                                    )}
                                </form>

                                <div style={{ width: '100%', display: 'flex', margin: 'auto', flexDirection: 'column', textAlign: 'center', fontSize: '14px' }}>
                                    {isLogin ? (
                                        <div style={{ justifyContent: 'center', display: 'flex', marginTop: '10px' }}>
                                            Don't have an account ? {" "}
                                            <span onClick={() => setIsLogin(false)} style={{ cursor: "pointer", color: '#bc7700', marginLeft: '5px' }}>
                                                Register here
                                            </span>
                                        </div>
                                    ) : (
                                        <div style={{ justifyContent: 'center', display: 'flex', marginTop: '10px' }}>
                                            Already have an account?{" "}
                                            <span onClick={() => setIsLogin(true)} style={{ cursor: "pointer", color: '#bc7700', marginLeft: '5px' }}>
                                                Login here
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
            </IonPage>
        </>
    );
}

export default Login;
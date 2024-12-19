import React, { useContext, useRef, useEffect, useState, useCallback } from 'react';
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
    IonSelect,
    IonSelectOption,
    IonPopover,
    IonAccordion,
    IonAccordionGroup,
    IonRadio,
    IonRadioGroup,
    IonTextarea,
    IonChip,
    IonicSlides,
    IonButtons,
} from '@ionic/react';
import { IonCol, IonGrid, IonRow, IonTabButton } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useDispatch, useSelector } from "react-redux";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '../pages/Tab1.css';
import Like from '../pages/like';
import '@ionic/react/css/ionic-swiper.css';
import 'swiper/css/autoplay';
import 'swiper/css/keyboard';
import Header from './head';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/zoom';
import { Autoplay, Keyboard, Pagination, Scrollbar, Zoom, Navigation } from 'swiper/modules';
import { useParams } from "react-router-dom";
import { IMG_PATH } from "../config";
import jwtAuthAxios from "../service/jwtAuth";
import { heartOutline, heart } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { DataContext } from "../context/DataProvider";
import { updateToCart, addToCart, showCarts } from "../store/actions";
import { toast } from "react-toastify";


function Product() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [productDetails, setProductDetails] = useState([]);
    const isFetching = useRef(false)
    const [count, setCount] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    const [diamondGroup, setDiamondGroup] = useState([]);
    const { wishData, setWishData } = useContext(DataContext);
    const [checkedItems, setCheckedItems] = useState({});
    const [liked, setLiked] = useState(false);
    const [sizeDetails, setSizeDetails] = useState([]);
    const [selectSize, setSelectSize] = useState(null);
    const [findings, setFindings] = useState([]);
    const [selectedFindings, setSelectedFindings] = useState('');
    const [cart, setCart] = useState([]);
    const [typeMessage, setTypeMessage] = useState("");

    // Handle modal open and close
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const incrementCounter = () => {
        if (count > 0) {
            setCount(count + 1);
        }
    };

    const decrementCounter = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };



    const fetchProductData = async () => {
        if (isFetching.current) return;
        isFetching.current = true;
        setLoading(true);
        try {
            const response = await jwtAuthAxios.get(`master/citems/${id}`);
            setProductDetails(response?.data?.item);
            setDiamondGroup(response?.data?.diamGroup?.data);
            setSelectSize(response?.data?.size?.sizes[0]?.size);
            setSizeDetails(response?.data?.size?.sizes);
            setFindings(response?.data?.size?.findings);
            setError(null);
        } catch (error) {
            setError('Failed to load category details. Please try again later.');
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    };


    const handleAddToCart = async (e, id) => {
        if (isFetching.current) return;
        isFetching.current = true;
        try {
            let payload = {
                itemId: id,
                quantity: count,
                metal: `${selectedType}-${selectedMetal}-GOLD`,
                diamondQuality: selectedQuality,
                size: selectSize ? selectSize : sizeDetails?.[0]?.size,
                message: typeMessage,
                finding: selectedFindings,
                colorstone: colorstone,
                diaqty: diaqty,
                centerctwt: centerctwt,
                sidectwt: sidectwt

            };
            toast.success("Item added to cart");
            await jwtAuthAxios.post("client/cart/add", payload);
            dispatch(addToCart({ itemId: id, quantity: count }));

        } catch (error) {
            console.error(error?.response?.data?.error);
        }
        finally {
            setLoading(false);
            isFetching.current = false;
        }
    };



    const {
        _id,
        sku,
        name,
        description,
        category,
        collection,
        otherUploadImg,
        gramwt,
        diaqty,
        ctswts,
        diacolororclarity,
        metalType,
        metalcolor,
        price,
        metal,
        thumbnailImage,
        centerctwt,
        sidectwt,
        colorstone,
        wgt14k,
        wgt18k,
        pointer,
        itemsize,
        itemtype,
        attr
    } = productDetails;
    const [selectedMetal, setSelectedMetal] = useState(metalcolor);
    const [selectedQuality, setSelectedQuality] = useState(diamondGroup[0]);
    const [selectedType, setSelectedType] = useState("14K");


    useEffect(() => {
        fetchProductData();
    }, []);

    useEffect(() => {
        if (metalcolor) {
            setSelectedMetal(metalcolor?.toUpperCase());
        }
    }, [metalcolor]);

    useEffect(() => {
        if (diamondGroup) {
            setSelectedQuality(diamondGroup[0]);
        }
    }, [diamondGroup]);


    const handleSizeChange = (e) => {
        setSelectSize(e.target.value);
    };

    useEffect(() => {
        if (findings?.length > 0) {
            setSelectedFindings(findings[0].finding);
        }
    }, [findings]);

    const parseSize = (size) => {
        const match = size?.match(/(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : 0;
    };

    const sortedSizes = sizeDetails?.sort(
        (a, b) => parseSize(a?.size) - parseSize(b?.size)
    );

    const handleFindingsChange = (e) => {
        setSelectedFindings(e.target.value);
    };


    // useEffect(() => {
    // }, [selectedType]);

    const handleItemCheckboxChange = (id, data) => {
        setLiked(!liked);
        setCheckedItems((prevCheckedItems) => ({
            ...prevCheckedItems,
            [id]: !prevCheckedItems[id],
        }));

        const storedList = JSON.parse(localStorage.getItem("wishList")) || [];
        const itemIndex = storedList.findIndex((item) => item._id === data._id);

        if (itemIndex === -1) {
            storedList.push(data);
        } else {
            storedList.splice(itemIndex, 1);
        }
        setWishData(storedList);
    };

    useEffect(() => {
        const newCheckedItems = {};
        wishData?.forEach((item) => {
            if (item?._id) {
                newCheckedItems[item._id] = true;
            }
        });

        setCheckedItems(newCheckedItems);
    }, []);

    const handleTypeMessage = (e) => {
        setTypeMessage(e.target.value);
    };

    return (
        <>
            <Header />

            <IonContent color="primary" style={{ paddingBottom: '80x', marginBottom: '100px', marginTop: '10px' }}>
                <div style={{ marginTop: '20px' }}>
                    <h5 class="text-center mb-5 element">Ring Category</h5>
                </div>

                <div className='main-catagory'>
                    <IonGrid>
                        <IonRow>
                            <IonCol>
                                <div className="product-img">
                                    <div className='imgbtn' onClick={openModal}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-zoom-in" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0" />
                                            <path d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z" />
                                            <path fill-rule="evenodd" d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5" />
                                        </svg>
                                    </div>
                                    <Swiper
                                        style={{ marginBottom: '0px', marginTop: '7px', width: '223px' }}
                                        spaceBetween={50}
                                        slidesPerView={1}
                                        onSlideChange={() => console.log('slide change')}
                                        onSwiper={(swiper) => console.log(swiper)}
                                        navigation 
                                        autoplay={true}
                                        modules={[Autoplay, Keyboard, Pagination, Scrollbar, Zoom, Navigation]} // Include Navigation here
                                        keyboard={true}
                                        pagination={true}
                                        scrollbar={true}
                                        zoom={true}
                                    >
                                        <SwiperSlide style={{ background: 'transparent' }}>
                                            <IonImg
                                                className="slider-img pulsating-circle"
                                                src={IMG_PATH + otherUploadImg} alt="ig145"

                                                style={{
                                                    width: '150px',
                                                    height: '150px',
                                                    margin: '0',
                                                    objectFit: 'cover',
                                                    borderRadius: '9px',
                                                    overflow: 'hidden',
                                                }}

                                            />
                                        </SwiperSlide>
                                        {/* <SwiperSlide>
                                            <IonImg
                                                src="src/img/produc-maoin.jpg"
                                                style={{
                                                    width: '150px',
                                                    height: '150px',
                                                    margin: '0',
                                                    objectFit: 'cover',
                                                    borderRadius: '9px',
                                                    overflow: 'hidden',
                                                }}
                                            />
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <IonImg
                                                src="src/img/c-slider-3.png"
                                                style={{
                                                    width: '150px',
                                                    height: '150px',
                                                    margin: '0',
                                                    objectFit: 'cover',
                                                    borderRadius: '9px',
                                                    overflow: 'hidden',
                                                }}
                                            />
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <IonImg
                                                src="src/img/produc-maoin.jpg"
                                                style={{
                                                    width: '150px',
                                                    height: '150px',
                                                    margin: '0',
                                                    objectFit: 'cover',
                                                    borderRadius: '9px',
                                                    overflow: 'hidden',
                                                }}
                                            />
                                        </SwiperSlide> */}
                                    </Swiper>
                                </div>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <div className='productreduiom' style={{ marginTop: '50px' }}>
                                    <IonChip color="secondary" style={{ fontWeight: '500px' }}>{sku}</IonChip>
                                    <h5 style={{ color: 'black' }}>{description}</h5>
                                </div>
                                <div className='productreduio'>
                                    <h6>Metal</h6>
                                    <div className='main-lan'>
                                        <IonRadioGroup value={selectedType} onIonChange={e => setSelectedType(e.detail.value)} expand="block" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0' }}>
                                            <IonRadio
                                                className="btn btn-default"
                                                value="14K"
                                                color='secondary'
                                                expand="full"
                                                style={{ color: 'black', marginRight: '0', width: '100%', maxWidth: "100%" }}
                                            >
                                                <div style={{ width: '100%', }}>
                                                    <span className="option-label">14K Gold</span>
                                                    <div className="px-product" style={{ display: 'flex', alignItems: 'center', flexFlow: 'wrap' }}>
                                                        {wgt14k?.toFixed(2)} Grams
                                                        <sub style={{ color: "rgb(76 50 38)", display: 'block' }}>* Approx. Weight</sub>
                                                    </div>
                                                </div>
                                            </IonRadio>

                                            <IonRadio
                                                className="btn btn-default"
                                                value="18K"
                                                color='secondary'
                                                expand="full"
                                                style={{ color: 'black', marginRight: '0', width: '100%', maxWidth: "100%" }}
                                            >
                                                <div style={{ width: '100%' }}>
                                                    <span className="option-label">18K Gold</span>
                                                    <div className="px-product" style={{ display: 'flex', alignItems: 'center', flexFlow: 'wrap' }}>
                                                        {wgt18k?.toFixed(2)} Grams
                                                        <sub style={{ color: "rgb(76 50 38)", display: 'block' }}>* Approx. Weight</sub>
                                                    </div>
                                                </div>
                                            </IonRadio>
                                        </IonRadioGroup>

                                        <div className='main-color'>
                                            <h6>Metal Color</h6>

                                            <IonRadioGroup value={selectedMetal} onIonChange={e => setSelectedMetal(e.detail.value)} expand="block" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0' }}>
                                                {["ROSE", "WHITE", "YELLOW"].map((metal) => (
                                                    <IonRadio
                                                        key={metal}
                                                        className="btn btn-default"
                                                        value={metal}
                                                        color='secondary'
                                                        labelPlacement="fixed"
                                                        alignment="center"
                                                        style={{ color: 'black', marginRight: '0', maxWidth: '110px' }}
                                                    >
                                                        <div style={{ width: '85%' }}>
                                                            <span className="option-label">
                                                                <IonImg className='slider-img pulsating-circle'
                                                                    src={`src/img/color-${metal.toLowerCase()}.svg`} // Assuming images are named color-rose.svg, etc.
                                                                    style={{ width: '26px', height: '26px', objectFit: 'cover', borderRadius: '9px' }}
                                                                />
                                                            </span>
                                                            <div className="px-product">
                                                                {metal}
                                                            </div>
                                                        </div>
                                                    </IonRadio>
                                                ))}
                                            </IonRadioGroup>
                                        </div>
                                    </div>
                                    <div className='diamondcolmin'>
                                        {/* <IonRadioGroup value="end" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0' }}>
                                        <div className='diamondcol'>
                                            <IonRadio slot='end' labelPlacement="end" value="grapes" color='secondary' style={{ color: '#4c3226', marginRight: '0', width: '100%' }}>DEF VS+</IonRadio>
                                        </div>
                                        <div className='diamondcol'>
                                            <IonRadio value="strawberries" labelPlacement="end" color='secondary' style={{ color: '#4c3226', marginRight: '0', width: '100%' }}>EF VS+</IonRadio>
                                        </div>
                                    </IonRadioGroup> */}
                                        <h6>Diamond Quality</h6>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0' }} className='diamondcol'>
                                            {diamondGroup?.map((item, i) => {
                                                return (
                                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0' }}>
                                                        <div className='diamondcol'>
                                                            <label style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                border: '1px solid rgb(115 91 80)',
                                                                borderRadius: '4px',
                                                                padding: '5px 10px',
                                                                backgroundColor: selectedQuality === item ? 'rgb(255 230 202)' : 'rgb(255 246 236)',
                                                                cursor: 'pointer'
                                                            }}>
                                                                <input
                                                                    style={{ marginRight: '10px' }}
                                                                    type="radio"
                                                                    name="quality"
                                                                    checked={selectedQuality === item}
                                                                    onChange={() => setSelectedQuality(item)}
                                                                />
                                                                <span style={{ color: '#4c3226' }}>{item}</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <IonCol>
                                        {colorstone ? (
                                            <div value="end" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0' }}>
                                                <span style={{ color: 'rgb(73 69 69)', fontSize: '15px', borderRadius: '20  px', marginTop: '16px', padding: '5px 25px', border: '1px solid #9f9993', }}>Color Stone Details : <div slot='end'
                                                    labelPlacement="end" style={{ color: 'rgb(76, 50, 38)', marginRight: '0', marginTop: '5px', fontSize: '14px' }}>{colorstone}</div></span>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </IonCol>
                                    <IonCol>
                                        {sortedSizes?.length > 0 && (
                                            <IonSelect
                                                value={selectSize}
                                                placeholder="Select Size"
                                                onIonChange={(e) => handleSizeChange(e)}
                                                interface="popover"
                                                style={{
                                                    fontSize: '14px',
                                                    border: '1px solid #7f7d7d',
                                                    backgroundColor: '#fff6ec',
                                                    color: 'rgb(76 50 38)',
                                                    padding: '0px 12px'
                                                }}
                                                size="small"
                                            >
                                                {sortedSizes?.map((size) => (
                                                    <IonSelectOption key={size?._id} value={size?.size}>
                                                        {size?.size}
                                                    </IonSelectOption>
                                                ))}
                                            </IonSelect>
                                        )}
                                    </IonCol>
                                    <IonCol>
                                        {findings?.length > 0 && (
                                            <IonSelect
                                                value={selectedFindings || (findings.length > 0 ? findings[0].finding : "")}
                                                placeholder="Select Finding"
                                                onIonChange={(e) => handleFindingsChange(e)}
                                                interface="popover"
                                                style={{
                                                    fontSize: '14px',
                                                    border: '1px solid #7f7d7d',
                                                    backgroundColor: '#fff6ec',
                                                    color: 'rgb(76 50 38)',
                                                    padding: '0px 12px'
                                                }}
                                                size="small"
                                            >
                                                {findings?.map((finding, i) => (
                                                    <IonSelectOption key={finding?._id} value={finding?.finding}>
                                                        {finding?.finding}
                                                    </IonSelectOption>
                                                ))}
                                            </IonSelect>
                                        )}
                                    </IonCol>
                                    <IonTextarea
                                        fill="outline"
                                        onIonChange={(e) => handleTypeMessage(e)}
                                        placeholder="Type Message (Special Instruction eg: Nickel Free, No Rhodium Tip, Inscriptions etc.)"
                                        style={{ color: '#201d1d', marginTop: '15px', height: '70px', fontSize: '14px' }}
                                    ></IonTextarea>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div className='main-coune' style={{ display: 'flex', alignItems: 'center', margin: '10px 0', fontFamily: 'Poppins' }}>
                                            <IonButton fill="clear" size='large' slot="icon-only" onClick={decrementCounter}>
                                                <div style={{ border: '2px solid rgb(159 153 147)', padding: '8px 13px', borderRadius: ' 5px 0px 0px 5px' }}>
                                                    <ion-icon name="remove-circle-outline" slot="icon-only" style={{ color: ' black' }}></ion-icon>
                                                </div>
                                            </IonButton>
                                            <span style={{
                                                margin: '0px 2px', width: '40px', textAlign: 'center', color: '#47342b'
                                            }}>{count}</span>
                                            < IonButton fill="clear" size='large' onClick={incrementCounter} >
                                                <div style={{ border: '2px solid rgb(159 153 147)', padding: '8px 13px', borderRadius: ' 0px 5px 5px 0px' }}>
                                                    <ion-icon name="add-circle-outline" slot="icon-only" style={{ color: ' black' }}></ion-icon>
                                                </div>
                                            </IonButton>
                                        </div>
                                        <IonButton
                                            id={_id}
                                            color={checkedItems[_id] ? "danger" : "medium"}
                                            fill="clear"
                                            onClick={() => handleItemCheckboxChange(_id, productDetails)}
                                        >
                                            <IonIcon
                                                slot="icon-only"
                                                size="large"
                                                icon={checkedItems[_id] ? heart : heartOutline}
                                            />
                                        </IonButton>
                                    </div>
                                    <div className='adtocard'>
                                        <IonButton className='addticaed' expand="block" onClick={(e) => handleAddToCart(e, _id)}>ADD  TO   CART</IonButton>
                                    </div>
                                    <div className="product-detail text-center mb-3 mt-3">

                                        <div
                                            className="product-details-title d-flex align-items-center justify-content-between"
                                            style={{
                                                borderBottom: "1px solid #bfbfbf",
                                                paddingBottom: "5px",
                                            }}
                                        >
                                            <span className="d-block">Diamond  Specification</span>
                                            <span
                                                className="d-block "
                                                style={{ fontSize: "15px" }}
                                            >
                                                {sku}
                                            </span>
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 35px 25px' }}>
                                                <div style={{ textAlign: 'center' }}>
                                                    <div
                                                        style={{
                                                            fontSize: "18px",
                                                            display: "block",
                                                            marginBottom: "7px",
                                                            paddingTop: "14px",
                                                        }}
                                                    >
                                                        Side Cts.
                                                    </div>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="25"
                                                        height="25"
                                                        fill="currentColor"
                                                        className="bi bi-gem"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="M3.1.7a.5.5 0 0 1 .4-.2h9a.5.5 0 0 1 .4.2l2.976 3.974c.149.185.156.45.01.644L8.4 15.3a.5.5 0 0 1-.8 0L.1 5.3a.5.5 0 0 1 0-.6zm11.386 3.785-1.806-2.41-.776 2.413zm-3.633.004.961-2.989H4.186l.963 2.995zM5.47 5.495 8 13.366l2.532-7.876zm-1.371-.999-.78-2.422-1.818 2.425zM1.499 5.5l5.113 6.817-2.192-6.82zm7.889 6.817 5.123-6.83-2.928.002z" />
                                                    </svg>
                                                    <a
                                                        href="#"

                                                        style={{
                                                            color: "rgb(195 152 98)",
                                                            fontSize: "15px",
                                                            fontFamily: 'Poppins',
                                                            fontWeight: "400",
                                                            lineHeight: "1",
                                                            width: "fit-content",
                                                            margin: "14px auto 0px",
                                                            display: "block",
                                                            textDecoration: "none",

                                                        }}
                                                    >

                                                        {sidectwt?.toFixed(2)} Total Cts
                                                    </a>
                                                </div>
                                                <div>*Approx. Weight</div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <div
                                                        style={{
                                                            fontSize: "18px",
                                                            display: "block",
                                                            marginBottom: "7px",
                                                            paddingTop: "14px",
                                                        }}
                                                    >
                                                        Center Cts.
                                                    </div>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        xlink="http://www.w3.org/1999/xlink"
                                                        fill="#000000"
                                                        height="25"
                                                        width="25"
                                                        version="1.1"
                                                        id="Capa_1"
                                                        viewBox="0 0 434.781 434.781"
                                                        space="preserve"
                                                    >
                                                        <g>
                                                            <path d="M296.774,28.276c-2.813-2.813-6.628-4.394-10.606-4.394H128.395c-3.979,0-7.793,1.58-10.606,4.394L6.226,139.839   c-2.813,2.813-4.394,6.628-4.394,10.606v157.773c0,3.979,1.581,7.794,4.394,10.606l111.563,111.563   c2.813,2.813,6.628,4.394,10.606,4.394h157.773c3.979,0,7.794-1.58,10.606-4.394l111.563-111.563   c2.813-2.813,4.394-6.628,4.394-10.606V150.445c0-3.979-1.58-7.794-4.394-10.606L296.774,28.276z M302.73,258.044V200.62l80-33.137   v123.698L302.73,258.044z M235.993,133.883h-57.424l-33.137-80H269.13L235.993,133.883z M176.029,153.883h62.504l12.458,12.458   L140.758,269.51l-8.926-8.926V198.08L176.029,153.883z M265.14,180.49l7.58,7.581L162.487,291.239l-7.58-7.581L265.14,180.49z    M178.569,324.781h57.424l33.137,80H145.432L178.569,324.781z M238.533,304.781h-61.248l105.446-98.688v54.49L238.533,304.781z    M375.077,149.004l-80,33.137l-40.604-40.604l33.137-80L375.077,149.004z M126.954,61.537l33.137,80l-40.606,40.605l-80-33.137   L126.954,61.537z M111.832,200.62v57.425l-80,33.137V167.483L111.832,200.62z M39.486,309.66l80-33.137l40.606,40.605l-33.137,80   L39.486,309.66z M287.609,397.127l-33.137-80l40.604-40.604l80,33.137L287.609,397.127z" />
                                                            <path d="M422.949,35h-25V10c0-5.522-4.478-10-10-10s-10,4.478-10,10v25h-25c-5.522,0-10,4.478-10,10s4.478,10,10,10h25v25   c0,5.522,4.478,10,10,10s10-4.478,10-10V55h25c5.522,0,10-4.478,10-10S428.472,35,422.949,35z" />
                                                        </g>
                                                    </svg>
                                                    <a
                                                        href="#"
                                                        className="d-block mb-2"
                                                        style={{
                                                            color: "rgb(195 152 98)",
                                                            fontSize: "15px",
                                                            fontFamily: 'Poppins',
                                                            fontWeight: "400",
                                                            lineHeight: "1",
                                                            width: "fit-content",
                                                            margin: "14px auto 0px",
                                                            display: "block",
                                                            textDecoration: "none",

                                                        }}
                                                    >
                                                        {centerctwt?.toFixed(2)} Total Cts{" "}
                                                    </a>
                                                </div>
                                            </div>
                                            <div style={{
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: "1px solid #bfbfbf",
                                                paddingTop: "5px"
                                            }}  >
                                                <h6 style={{ margin: '0' }}>Total Weight</h6>
                                                <span>  {ctswts?.toFixed(2)} Cts</span>
                                            </div>


                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <h6 style={{ margin: '0' }}>Number of Diamonds</h6>
                                                <span> {diaqty} Pcs</span>
                                            </div>


                                            {itemsize ? (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <h6 style={{ margin: '0' }}>Item size</h6>
                                                    <span> {itemsize}</span>
                                                </div>
                                            ) : (
                                                ""
                                            )}

                                        </div>
                                    </div>
                                    <div className='disclaimer-main'>
                                        <div className='stickdsclaimer'>Disclaimer</div>
                                        <h6>- Unless otherwise stated, the color, purity, and metal tone will be as mentioned in the master and prompt style.</h6>

                                        <h6>- A diamond tolerance of 5% will be allowed.</h6>

                                        <h6>- The Legend of Zelda</h6>
                                    </div>
                                </div>
                            </IonCol>
                        </IonRow>
                    </IonGrid>

                </div >
            </IonContent >
            {/* Modal to open Swiper slider */}
            < IonModal isOpen={isModalOpen} onDidDismiss={closeModal} >
                <div className='mainmodal'  >
                    <IonButtons slot="end">
                        <IonButton shape='round' width='auto' color='secondary' type='button' onClick={closeModal}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                            </svg>
                        </IonButton>
                    </IonButtons>
                    <Swiper
                        style={{ marginBottom: '0px', marginTop: '7px', width: '100%' }}
                        spaceBetween={50}
                        slidesPerView={1}
                        onSlideChange={() => console.log('slide change')}
                        onSwiper={(swiper) => console.log(swiper)}
                        autoplay={true}
                    >
                        <SwiperSlide>
                            <IonImg
                                src={IMG_PATH + otherUploadImg} alt="ig145"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'cover',
                                    borderRadius: '9px',
                                    overflow: 'hidden',
                                }}
                            />
                        </SwiperSlide>
                        {/* <SwiperSlide>
                            <IonImg
                                src="src/img/produc-maoin.jpg"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'cover',
                                    borderRadius: '9px',
                                    overflow: 'hidden',
                                }}
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <IonImg
                                src="src/img/produc-maoin.jpg"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'cover',
                                    borderRadius: '9px',
                                    overflow: 'hidden',
                                }}
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <IonImg
                                src="src/img/produc-maoin.jpg"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'cover',
                                    borderRadius: '9px',
                                    overflow: 'hidden',
                                }}
                            />
                        </SwiperSlide> */}
                    </Swiper>
                </div>
            </IonModal >
        </ >
    );
}
export default Product; 
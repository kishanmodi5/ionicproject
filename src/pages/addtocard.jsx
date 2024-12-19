import React, { useRef, useEffect, useState, useContext } from 'react';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonItem,
  IonList,
  IonThumbnail,
  IonButton,
  IonButtons,
  IonCardTitle,
  IonRadio,
  IonRadioGroup,
  IonImg,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonInput,

} from '@ionic/react';
import '../pages/Tab1.css';
import '../main';
import { IonCol, IonGrid, IonRow, IonTabButton } from '@ionic/react';
import Header from './head';
import { IonTextarea } from '@ionic/react';
import { IonModal } from '@ionic/react';
import { addToCart, clearCart, updateToCart } from "../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { IMG_PATH } from "../config";
import jwtAuthAxios from "../service/jwtAuth";
import { DataContext } from "../context/DataProvider";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";



const RadioPage = () => {
  const { id } = useParams();
  const [counter, setCounter] = useState(0);
  const items = useSelector((state) => state.items.cart);
  const dispatch = useDispatch();
  const [productDetails, setProductDetails] = useState([]);
  const [selectedType, setSelectedType] = useState("14K");
  const [sizeDetails, setSizeDetails] = useState([]);
  const [selectSize, setSelectSize] = useState(null);
  const [findings, setFindings] = useState([]);
  const [selectedFindings, setSelectedFindings] = useState('');
  const [diamondGroup, setDiamondGroup] = useState([]);
  const [openModalId, setOpenModalId] = useState(null);
  const [cartDetails, setCartDetails] = useState([]);
  const isFetching = useRef(false)
  const {
    wgt14k,
    wgt18k,
    metalcolor,
  } = productDetails;
  const [selectedMetal, setSelectedMetal] = useState(metalcolor);
  const [selectedQuality, setSelectedQuality] = useState('');
  const [editId, setEditId] = useState(null);
  const [editItemId, setEditItemId] = useState(null);
  const [editItemDetails, setEditItemDetails] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userDetail, setUserDetail] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [form, setForm] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    companyName: "",
    referenceName: "",
  });
  const history = useHistory();




  const fetchDataForItem = async (item) => {
    if (isFetching.current) return;
    isFetching.current = true;
    try {
      const response = await jwtAuthAxios.get(
        `master/alldetails?id=${item?.item?.itemtype}`
      );
      setProductDetails(response?.data);
      setSizeDetails(response?.data?.categorySizes);
      setDiamondGroup(response?.data?.diamondParams);
      setFindings(response?.data?.categorySizes[0]?.findings);

      // Set the state variables here
      const metalParts = item.metal.split("-");
      const metalType = metalParts[0];
      const metalcolor = metalParts[1];

      setSelectedType(metalType);
      setSelectedMetal(metalcolor?.toUpperCase());
      setSelectedFindings(item?.finding);
      setSelectedQuality(item?.diamondQuality);
      setSelectSize(item?.size);
      setEditId(item?._id);
      setEditItemId(item?.item?._id);
      setEditItemDetails(item);

    } catch (error) {
      console.error(error?.response?.data?.error);
    }
    finally {
      isFetching.current = false;
    }
  };


  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };


  const handleRemoveItem = async (id) => {
    try {
      let payload = {
        itemId: id,
      };
      const response = await jwtAuthAxios.post("client/cart/remove", payload);
      toast.success("Item removed successfully!");
      dispatch(addToCart());
      fetchCartData();
    } catch (error) {
      console.error(error?.response?.data?.error);
    }
  };



  const handleSaveChanges = (e, index) => {
    const updatedItem = {
      ...editItemDetails,
      metal: `${selectedType}-${selectedMetal}-GOLD`,
      diamondQuality: selectedQuality,
      size: selectSize,
      finding: selectedFindings,
    };

    setCartDetails((prevCart) => ({
      ...prevCart,
      items: prevCart.items.map((item, ind) =>
        item.item._id === editItemId && ind === index ? updatedItem : item
      ),
    }));

    dispatch(
      updateToCart({
        itemId: editId,
        quantity: editItemDetails?.quantity,
        metal: `${selectedType}-${selectedMetal}-GOLD`,
        diamondQuality: selectedQuality,
        size: selectSize,
        finding: selectedFindings,
      })
    );
    toast.success("Update Successfully!");
    setOpenModalId(false);
  };

  const handleSizeChange = (e) => {
    setSelectSize(e.target.value);
  };

  const handleFindingsChange = (e) => {
    setSelectedFindings(e.target.value);
  };


  const openModal = (itemId) => {
    setOpenModalId(itemId);
  };

  const closeModal = () => {
    setOpenModalId(null);
  };


  const handleEditClick = (item) => {
    fetchDataForItem(item);
    openModal(item?._id);
  };


  const handleQuantityChange = (itemId, ind, delta, quantity, id) => {
    setCartDetails((prevCart) => ({
      ...prevCart,
      items: prevCart.items.map((item, index) =>
        item.item._id === itemId && index === ind
          ? { ...item, quantity: item.quantity + delta }
          : item
      ),
    }));
    dispatch(updateToCart({ itemId: id, quantity: quantity + delta }));
  };


  const parseSize = (size) => {
    const match = size?.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const sortedSizes = sizeDetails?.sort(
    (a, b) => parseSize(a?.size) - parseSize(b?.size)
  );

  useEffect(() => {
    if (findings?.length > 0) {
      setSelectedFindings(findings[0].finding);
    }
  }, [findings]);



  const fetchCartData = async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    try {
      const response = await jwtAuthAxios.get("client/cart");
      setCartDetails(response?.data);
    } catch (error) {
      console.error(error?.response?.data?.error);
    }
    finally {
      isFetching.current = false;
    }
  };


  useEffect(() => {
    fetchCartData();
  }, []);


  useEffect(() => {
    if (metalcolor) {
      setSelectedMetal(metalcolor?.toUpperCase());
    }
  }, [metalcolor]);

  const handleTypeMessage = (id, e, index) => {
    setCartDetails((prevCart) => {
      return {
        ...prevCart,
        items: prevCart.items?.map((item, ind) =>
          item?.item._id === id && ind === index
            ? {
              ...item,
              message: e.target.value,
            }
            : item
        ),
      };
    });
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let err = [];

    if (err?.length > 0) {
      alert("Please address the following issues: \n" + err.join("\n"));
      return err;
    } else {
    }

    if (
      !form.fullName ||
      !form.mobileNumber ||
      !form.email ||
      !form?.companyName
    ) {
      alert("Please fill in all User required fields.");
      return;
    }
    try {
      let payload = {
        user: form,
        items: cartDetails,
      };
      const response = await jwtAuthAxios.post("client/quote-request", payload);
      toast.success("Quote Request submitted successfully!");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...userDetail,
          username: form?.fullName,
          email: form?.email,
          phone: form?.mobileNumber,
          companyName: form?.companyName,
          referenceName: form?.referenceName,
        })
      );
      dispatch(clearCart());
      history.push("/thanks")
      window.location.href = '/thanks';

    } catch (error) {
      console.error(error?.response?.data?.error);
    }
  };

  useEffect(() => {
    setForm({
      fullName: userDetail?.username,
      mobileNumber: "",
      email: '',
      companyName: '',
      referenceName: userDetail?.referenceName,
    });
  }, [userDetail]);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      if (updatedUser) {
        setUserDetail(JSON.parse(updatedUser));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);


  return (
    <>
      <Header />


      <IonContent color="primary" style={{ paddingBottom: '80x', marginBottom: '100px' }}>
        <h4 className="text-center mb-5 element" style={{ marginTop: '20px' }}>add to Card</h4>
        {cartDetails?.items?.length === 0 || cartDetails?.message ? (
          <div
            style={{
              background: "white",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: 'center'
            }}
          >
            <div>
              <IonImg
                src='src/img/datanotfound.png'
                style={{ maxWidth: "360px", width: "100%" }}
              />
              <h3 style={{ textAlign: 'center' }}>Your cart is empty</h3>
            </div>
          </div>
        ) : (
          <div style={{ paddingBottom: '80x', marginBottom: '100px', position: 'relative' }}>
            {cartDetails?.items?.map((item, index) => (
              <div style={{ padding: ' 0', border: '1px solid rgb(0 0 0 / 19%)', margin: '10px', borderRadius: '9px', background: '#fff' }}>
                <IonGrid>
                  <IonRow key={`${item.item?._id}-${index}`} style={{ marginBottom: '15px' }}>
                    <IonCol size='12'>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'space-between' }}>
                        <IonCardTitle style={{ color: 'black', justifyContent: 'center', display: 'flex', fontSize: '16px' }}>
                          {item?.item?.name}
                        </IonCardTitle>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <div>
                            <IonButton shape='round' onClick={() => handleEditClick(item)} >
                              <div key={`${item.item?._id}-${index}`}>
                                <Ion-Icon name="create-outline" slot="icon-only" size='small' style={{ color: 'red' }}></Ion-Icon>
                              </div>
                            </IonButton>
                          </div>
                          <IonButton shape='round' onClick={() => handleRemoveItem(item?.item?._id)}>
                            <Ion-Icon slot="icon-only" size='small' name="trash-outline" style={{ color: ' red' }}></Ion-Icon>
                          </IonButton>
                        </div>
                      </div>
                    </IonCol>
                    <IonCol size="4">
                      <IonCardHeader style={{ padding: '0px', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                        <img src={IMG_PATH + item?.item?.thumbnailImage}
                          alt={item?.sku} style={{ maxWidth: "160px", width: '100%', height: '125px', objectFit: 'contain' }} />
                        <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0', fontFamily: 'Poppins' }}>
                          <IonButton fill="clear" size='large' slot="icon-only" onClick={() =>
                            handleQuantityChange(
                              item?.item?._id,
                              index,
                              -1,
                              item?.quantity,
                              item?._id
                            )
                          }
                            disabled={item?.quantity === 1}
                          >
                            <div style={{ border: '1px solid #000000b8', padding: '5px', borderRadius: ' 10px 0px 0px 10px' }}>
                              <ion-icon name="remove-circle-outline" slot="icon-only" style={{ color: ' black' }}></ion-icon>
                            </div>
                          </IonButton>
                          <span style={{
                            margin: '0px 2px', width: '16px', textAlign: 'center'
                          }}>{item?.quantity}</span>
                          < IonButton fill="clear" size='large' onClick={() =>
                            handleQuantityChange(
                              item?.item?._id,
                              index,
                              1,
                              item?.quantity,
                              item?._id
                            )
                          }
                          >
                            <div style={{ border: '1px solid #000000b8', padding: '5px', borderRadius: ' 0px 10px 10px 0px' }}>
                              <ion-icon name="add-circle-outline" slot="icon-only" style={{ color: ' black' }}></ion-icon>
                            </div>
                          </IonButton>
                        </div>
                      </IonCardHeader>

                    </IonCol>
                    <IonCol size="8">
                      <IonCardContent style={{ padding: '0', border: '0' }} border="0">
                        <IonList style={{ border: '0' }}>
                          <div style={{ border: '0' }}>
                            <div className='d-block' style={{ paddingBottom: '10px' }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '5px', marginBottom: '10px', }}>
                                <span className="badge me-2" style={{ fontSize: '11px' }}>{item?.metal}</span>
                                <span className="badge me-2" style={{ fontSize: '11px' }}>{item?.size}</span>
                                <span className="badge me-2" style={{ fontSize: '11px' }}>{item?.finding}</span>
                                <span className="badge me-2" style={{ fontSize: '11px' }}>{item?.diamondQuality}</span>
                                <span className="badge me-2" style={{ fontSize: '11px' }}> {item?.item?.colorstone}</span>
                                {item?.item?.sidectwt > 0 && (
                                  <span className="badge me-2" style={{ fontSize: '11px' }}>
                                    Side Cts : {(item?.item?.sidectwt).toFixed(2)}
                                  </span>
                                )}
                                {item?.item?.centerctwt > 0 && (
                                  <span className="badge me-2" style={{ fontSize: '11px' }}>
                                    Center Cts :{" "}
                                    {(item?.item?.centerctwt).toFixed(2)}
                                  </span>
                                )}
                                <span className="badge me-2" style={{ fontSize: '11px' }}>Total Diamonds :{item?.item?.diaqty}</span>
                                <span className="badge me-2" style={{ fontSize: '11px' }}>
                                  {selectedType === "14K" && `14k weight : ${item?.item?.wgt14k?.toFixed(2)}`}
                                </span>
                                <span className="badge me-2" style={{ fontSize: '11px' }}>
                                  {selectedType === "18K" && `18k weight : ${item?.item?.wgt18k?.toFixed(2)}`}
                                </span>
                              </div>
                              <IonTextarea
                                fill="outline"
                                placeholder="Type Message"
                                style={{ color: 'black' }}
                                value={item?.message || ''}
                                onIonChange={(e) => handleTypeMessage(item?.item?._id, e, index)}
                              ></IonTextarea>
                            </div>
                          </div>
                        </IonList>
                      </IonCardContent>
                    </IonCol>
                    <div>
                      {openModalId === item?._id && (
                        <div className="popup-1" >
                          <div className="popup">

                            <IonRow>
                              <div>
                                <h6>Metal</h6>
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
                                        {item?.item.wgt14k?.toFixed(2)} Grams
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
                                        {item?.item.wgt18k?.toFixed(2)} Grams
                                        <sub style={{ color: "rgb(76 50 38)", display: 'block' }}>* Approx. Weight</sub>
                                      </div>
                                    </div>
                                  </IonRadio>
                                </IonRadioGroup>
                              </div>
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
                                      style={{ color: 'black', marginRight: '0', maxWidth: '100px' }}
                                    >
                                      <div style={{ width: '80%' }}>
                                        <span className="option-label">
                                          <IonImg className='slider-img pulsating-circle'
                                            src={`src/img/color-${metal.toLowerCase()}.svg`}
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
                              <div className="d-qulity">
                              
                                <h6>Diamond Quality</h6>
                                <form style={{ display: 'flex', gap: '10px' }}>
                                  
                                  {diamondGroup && diamondGroup.length > 0 ? (
                                    diamondGroup.map((item, i) => {
                                      return item.data.map((ele, j) => (
                                        <label
                                          key={j}
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            borderRadius: '12px',
                                            padding: '5px 11px',
                                            border: '1px solid #a7a7a7',
                                            backgroundColor: selectedQuality === ele ? 'rgb(255 230 202)' : 'transparent',
                                            transition: 'background-color 0.3s ease',
                                          }}
                                        >
                                          <input
                                            type="radio"
                                            name="quality"
                                            checked={selectedQuality === ele}
                                            onChange={() => setSelectedQuality(ele)}
                                            style={{ marginRight: '8px' }}
                                          />
                                          <span style={{ color: '#000', fontSize: '14px' }}>{ele}</span>
                                        </label>
                                      ));
                                    })
                                  ) : (
                                    <p>No diamond group data available</p>
                                  )}
                                </form>
                              </div>
                              <div>
                                <IonCol>
                                  {sortedSizes?.length > 0 &&
                                    sortedSizes[0]?.sizes &&
                                    sortedSizes[0]?.sizes?.length > 0 && (
                                      <IonSelect
                                        value={selectSize}
                                        placeholder="Select Size"
                                        onIonChange={(e) => handleSizeChange(e)}
                                        interface="popover"
                                        style={{
                                          borderRadius: '10px',
                                          // margin: '0px 0px 0px 10px',
                                          fontSize: '14px',
                                          border: '1px solid #7f7d7d',
                                          backgroundColor: '#fff6ec',
                                          color: 'rgb(76 50 38)',
                                          padding: '0px 35px'
                                        }}
                                        size="small"
                                      >
                                        {sortedSizes[0].sizes.map(
                                          (size, i) => (
                                            <IonSelectOption
                                              key={size?._id}
                                              value={size?.size}
                                            >
                                              {size?.size}
                                            </IonSelectOption>
                                          )
                                        )}

                                      </IonSelect>
                                    )}
                                  {findings?.length > 0 && (
                                    <IonSelect
                                      value={selectedFindings || ""}
                                      placeholder="Select Size"
                                      onIonChange={(e) => handleFindingsChange(e)}
                                      interface="popover"
                                      style={{
                                        borderRadius: '10px',

                                        fontSize: '14px',
                                        border: '1px solid #7f7d7d',
                                        backgroundColor: '#fff6ec',
                                        color: 'rgb(76 50 38)',
                                        padding: '0px 20px'
                                      }}
                                      size="small"
                                    >
                                      {findings.map((finding, i) => (
                                        <IonSelectOption
                                          key={finding?._id}
                                          value={finding?.finding}
                                        >
                                          {finding?.finding}
                                        </IonSelectOption>
                                      ))}

                                    </IonSelect>
                                  )}
                                </IonCol>
                              </div>
                            </IonRow>
                            <IonButton onClick={(e) => handleSaveChanges(e, index)} style={{ color: '#000', marginTop: '20px', }}>
                              Save
                            </IonButton>
                            <IonButton onClick={() => setOpenModalId(null)} style={{ color: '#000', marginTop: '20px' }}>
                              Close
                            </IonButton>
                          </div>
                        </div>
                      )}
                    </div>

                  </IonRow>
                </IonGrid>

              </div>
            ))}
            <div>
            </div>
          </div>
        )}

        <IonButton expand="block" color='secondary' onClick={toggleDropdown}>
          Open Profile
        </IonButton>


        {showDropdown && (
          <div className='profileque-1' style={{ position: 'absolute', right: '0px', top: '75px', height:'430px', overflow:'scroll' , border: '1px solid #ccc', zIndex: 1000 }}>
            <div style={{ fontSize: '24px', justifyContent: 'end', padding: '0', display: 'flex', marginBottom: '-14px', marginRight: '10px', marginTop: '10px' }}>
              <ion-icon name="close-outline" onClick={closeDropdown} style={{ color: '#000' }}></ion-icon>
            </div>
            <div className="profile" style={{ marginTop: '10px' }}>

              <IonCardHeader>
                <IonCardTitle style={{ color: 'rgb(76 50 38)', fontSize: '20px', fontFamily: 'auto', letterSpacing: '1.1px' }}>Quotation Details</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <form onSubmit={handleSubmit}>
                  <IonItem className="mb-3">
                    <IonLabel position="stacked" style={{ display: 'flex' }}>
                      Name:<span className="text-danger" style={{ color: 'red' }}>*</span>
                    </IonLabel>
                    <IonInput
                      value={form?.fullName}
                      onIonChange={handleInputChange}
                      type="text"
                      name="fullName"
                      required
                      disabled
                    />
                  </IonItem>
                  <IonItem className="mb-3" >
                    <IonLabel position="stacked" style={{ display: 'flex' }}>
                      Customer Mobile No:<span className="text-danger" style={{ color: 'red' }}>*</span>
                    </IonLabel>
                    <IonInput
                      value={form?.mobileNumber}
                      type="tel"
                      name="mobileNumber"
                      onIonChange={handleInputChange}
                      required
                      fill="clear"
                      color="secondary"
                    />
                  </IonItem>
                  <IonItem className="mb-3">
                    <IonLabel position="stacked" style={{ display: 'flex' }}>
                      Customer Email:<span className="text-danger" style={{ color: 'red' }}>*</span>
                    </IonLabel>
                    <IonInput
                      value={form?.email}
                      type="email"
                      name="email"
                      onIonChange={handleInputChange}
                       color="secondary"
                      required
                    />
                  </IonItem>
                  <IonItem className="mb-3" >
                    <IonLabel position="stacked" style={{ display: 'flex' }}>
                      Company Name:<span className="text-danger" style={{ color: 'red' }}>*</span>
                    </IonLabel>
                    <IonInput
                      value={form?.companyName}
                      type="text"
                      name="companyName"
                       color="secondary"
                      onIonChange={handleInputChange}
                      required
                    />
                  </IonItem>
                  <IonItem className="mb-3" >
                    <IonLabel position="stacked" style={{ display: 'flex' }}>
                      Reference Name:<span className="text-danger" style={{ color: 'red' }}>*</span>
                    </IonLabel>
                    <IonInput
                      value={form?.referenceName}
                      onIonChange={handleInputChange}
                      type="text"
                       color="secondary"
                      name="referenceName"
                      required
                    />
                  </IonItem>
                </form>
                <form onSubmit={handleSubmit}>
                  <IonButton expand="full" type="submit" style={{ background: '#feddb2', letterSpacing: '0.1px', margin: '10px', color: '#4c3226' }} >
                    Confirm Order (Ask for Quotation)
                  </IonButton>
                </form>
              </IonCardContent>

            </div>
          </div>
        )}
      </IonContent >



    </>
  );
};

export default RadioPage;
import React, { useContext, useEffect } from "react";
import Images from "../../static";
import { Page, Swiper } from "zmp-ui";
import "./styles.css";
import LessonHome from "./lessonHome";
import { IListAccess } from "./typesHome";
import ListHealthHome from "./listHealth";
import { listAccessHome } from "./dataStaticHome";
import ItemVideoBlog from "../../components/itemVideoBlog";
import { useNavigate } from "react-router-dom";
import path from "../../constants/path";
import { AppContext } from "../../contexts/app.context";
import { useQuery } from "@tanstack/react-query";
import ShowListBaby from "../../components/showListBaby";
import { showAgeByMonth } from "../../module";
import homeApi from "../../apis/home.apis";
import { API_URL_IMAGE } from "../../constants/utils";
import ItemProductHome from "../../components/itemProductHome";
import detailProblemApi from "../../apis/detailProblem.apis";
import { DetailProblem } from "../../types/detailProblem.type";
import { roundedNumber } from "../../utils/Utilities";
import ModalAddProduct from "../shop/modalAddProduct";
import { IProductShop } from "../../types/shop.types";
import communityApi from "../../apis/postCommunity.apis";
import { formatDecimalNumber } from "../../utils/Utilities";
import profileApi from "../../apis/profile.apis";
import { getIsFollowOA, saveListBabyToLS } from "../../utils/auth";
import ModalSearch from "./modalSearch";
import ModalSearchKey from "../../components/modalSearchKey";
import ModaNotify from "../../components/modaNotify";
import profileApiC from "../../apis/profileC.apis";
import CareOA from "../../CareOA";

export const TitleHome = ({
  icon,
  title,
  titleMore,
  onClick,
  isShowMore,
}: {
  icon: any;
  title: string;
  titleMore: string;
  isShowMore?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div className="flex items-center justify-between title-home pl-2 rounded-t-xl">
      <div className="flex items-center flex-1 h-9">
        <img src={icon} className="w-6 h-6 object-contain" />
        <span className="text-[#333333] font-medium text-[15px] ml-1 flex-1">
          {title}
        </span>
      </div>
      {!isShowMore && titleMore && (
        <div
          className="pr-2 pl-5 h-9 flex items-center justify-center"
          onClick={onClick}
        >
          <span className="text-[#333333] text-xs font-normal">
            {titleMore} {">"}
          </span>
        </div>
      )}
    </div>
  );
};
// @ts-ignore
export const BtnAccessHome = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-[#efefef] flex flex-col items-center w-full justify-center py-2 rounded-lg mt-2"
    >
      <div className="text-sm font-['Nunito'] font-bold text-center text-main">
        Truy cập
      </div>
    </div>
  );
};
const Home = () => {
  const navigate = useNavigate();
  const { selectedBaby, phoneUser, setProfile, setListBaby, setSelectedBaby } =
    useContext(AppContext);
  const [itemProductChoose, setItemProductChoose] =
    React.useState<IProductShop>();
  const [showAlert, setShowAlert] = React.useState(false);
  const [showAlert2, setShowAlert2] = React.useState(false);
  const [height, setHeight] = React.useState();
  const [heightWHO, setHeightWHO] = React.useState();
  const [weight, setWeight] = React.useState();
  const [weightWHO, setWeightWHO] = React.useState();
  const [grossMotor, setGrossMotor] = React.useState();
  const [fineMotor, setFineMotor] = React.useState();
  const [loadingIndex, setLoadingIndex] = React.useState(true);
  const [language, setLanguage] = React.useState();
  const [awareness, setAwareness] = React.useState();
  const [independent, setIndependentr] = React.useState();
  const [socialEmotions, setSocialEmotions] = React.useState();
  const [sense, setSense] = React.useState();
  const [modal, setModal] = React.useState<boolean>(false);
  const [modal2, setModal2] = React.useState<boolean>(false);
  const [listAccess] = React.useState<IListAccess[]>(listAccessHome);
  const [page, setPage] = React.useState<number>(1);
  const [lastPage, setLastPage] = React.useState<number>(1);
  const [listProblem, setListProblem] = React.useState<any[]>([]);
  // const [showFollow, setShowFollow] = React.useState<boolean>(false);
  const [listProductAccordingProblem, setListProductAccordingProblem] =
    React.useState<DetailProblem[]>([]);
  const refListBaby = React.useRef(null);
  const refModalAddProduct = React.useRef(null);
  const { data: dataBannerHome } = useQuery({
    queryKey: ["dataBannerHome"],
    queryFn: () => {
      return homeApi.getBannerHome();
    },
    staleTime: 10 * 60 * 1000,
  });
  const { data: dataPointCaculate } = useQuery({
    queryKey: ["dataPointCaculate"],
    queryFn: () => {
      return homeApi.caculateMoneyHome();
    },
    staleTime: 10 * 60 * 1000,
  });
  const { data: dataListShoppingHome } = useQuery({
    queryKey: ["dataListShoppingHome"],
    queryFn: () => {
      return homeApi.listShoppingHome();
    },
  });

  const { data: dataPointHome } = useQuery({
    queryKey: ["dataPointHome"],
    queryFn: () => {
      return homeApi.getPointHome();
    },
  });
  const getListProductAccordingProblem = async () => {
    const res = await detailProblemApi.getProblemList();
    if (res.status) {
      setListProductAccordingProblem(res?.data?.data?.data);
    } else {
      alert("có lỗi xảy ra");
    }
  };

  const getProblemList = async () => {
    if (selectedBaby?.name && page !== 1) {
      const res = await detailProblemApi.getProblemListMonth(
        page,
        selectedBaby?.realAge
      );
      if (res.status) {
        setListProblem([...listProblem, ...res?.data?.data?.data]);
        setLastPage(res?.data?.data?.last_page);
        setPage(res?.data?.data?.current_page);
      } else {
        alert("có lỗi xảy ra");
      }
    }
  };
  const getProblemListSelected = async () => {
    if (selectedBaby?.realAge !== undefined) {
      const res = await detailProblemApi.getProblemListMonth(
        1,
        selectedBaby?.realAge
      );
      if (res.status) {
        setListProblem(res?.data?.data?.data);
        setLastPage(res?.data?.data?.last_page);
        setPage(res?.data?.data?.current_page);
      } else {
        alert("có lỗi xảy ra");
      }
    }
  };
  // const saveFollowOA = async () => {
  //   try {
  //     let formData = new FormData();
  //     formData.append("phone", String(phoneUser));
  //     formData.append("type", "1");
  //     const res = await profileApi.savefollowOA(formData);
  //     setShowFollow(false);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  // const checkFollowOA = async () => {
  //   try {
  //     let formData = new FormData();
  //     formData.append("phone", String(phoneUser));
  //     const res = await profileApi.checkFollow(formData);
  //     if (res.status) {
  //       if (res.data.type === 0) {
  //         setShowFollow(true);
  //       } else {
  //         setShowFollow(false);
  //       }
  //     } else {
  //       alert("có lỗi xảy ra");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  const addMilestonWithMonthBaby = async () => {
    try {
      let formData = new FormData();
      formData.append("id_user_profiles", String(selectedBaby?.id));
      formData.append("id_month", String(selectedBaby?.realAge));
      const res = await profileApi.addMilestonWithMonthBaby(formData);
      if (res.status) {
        getHealthRecord();
      } else {
        alert("có lỗi xảy ra");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getHeightAndWeightWHO = async () => {
    try {
      let formData = new FormData();
      formData.append("month", `${selectedBaby?.realAge}`);
      formData.append("user_profiles_id", `${selectedBaby?.id}`);
      const res = await profileApi.getWHO(formData);
      if (res.status) {
        setHeight(res?.data?.data_health_user?.height);
        setWeight(res?.data?.data_health_user?.weight);
        setHeightWHO(res?.data?.data_health_who?.height);
        setWeightWHO(res?.data?.data_health_who?.weight);
      } else {
        alert("có lỗi xảy ra");
      }
    } catch (error) {
      console.log("lỗi " + error);
    }
  };
  const getHealthRecord = async () => {
    if (!!selectedBaby) {
      try {
        let formData = new FormData();
        setLoadingIndex(true);
        formData.append("id_month", `${selectedBaby?.realAge}`);
        formData.append("id_user_profiles", `${selectedBaby?.id}`);
        const res = await profileApi.getHealthRecord(formData);
        if (res.status) {
          setGrossMotor(res?.data?.data[111111].category);
          setFineMotor(res?.data?.data[222222].category);
          setLanguage(res?.data?.data[333333].category);
          setAwareness(res?.data?.data[444444].category);
          setIndependentr(res?.data?.data[555555].category);
          setSocialEmotions(res?.data?.data[666666].category);
          setSense(res?.data?.data[777777].category);
        } else {
          setLoadingIndex(true);
          alert("có lỗi xảy ra");
        }
      } catch (error) {
        setLoadingIndex(true);
        console.error("lỗi", error);
      } finally {
        setLoadingIndex(false);
      }
    }
  };
  const getProfile = async () => {
    try {
      const res = await profileApiC.getUserProfile();
      setProfile(res.data.data.user);
      setListBaby(res.data.data.baby);
      saveListBabyToLS(res.data.data.baby);
      setSelectedBaby(res.data.data.baby[0]);
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    getListProductAccordingProblem();
    getProfile();
  }, []);
  React.useEffect(() => {
    if (!phoneUser) {
      return;
    }
    // checkFollowOA();
  }, [phoneUser]);

  React.useEffect(() => {
    getHeightAndWeightWHO();
    addMilestonWithMonthBaby();
  }, [selectedBaby]);
  React.useEffect(() => {
    if (page >= 2) {
      getProblemList();
    }
  }, [page]);
  React.useEffect(() => {
    setPage(1);
    // setListProblem([]);
  }, [selectedBaby]);
  React.useEffect(() => {
    getProblemListSelected();
  }, [selectedBaby?.realAge]);
  const { data: dataVideoHome } = useQuery({
    queryKey: ["videoCommunity"],
    queryFn: () => {
      return communityApi.getVideoBlog({ page: 1 });
    },
    // @ts-ignore
    onError: (e) => {
      console.log(e);
    },
  });

  React.useEffect(() => {
    getListProductAccordingProblem();
  }, []);

  const cacupoint = () => {
    let point = 0;
    if (
      !!dataPointHome &&
      !!dataPointHome.data &&
      !!dataPointHome.data.data &&
      !!dataPointHome?.data?.data?.point &&
      !!dataPointCaculate &&
      !!dataPointCaculate.data &&
      !!dataPointCaculate.data.data &&
      !!dataPointCaculate.data.data.recipe
    ) {
      point =
        Number(dataPointHome?.data?.data?.point) *
        Number(dataPointCaculate.data.data.recipe);
    }
    return point;
  };

  const refInputImage = React.useRef<HTMLInputElement>(null);
  const handleUpload = () => {
    refInputImage.current?.click();
  };
  // const [selectedBaby2, setSelectedBaby2] = React.useState<any>(
  //   localStorage.getItem("list_baby")
  // );
  // @ts-ignore
  const InfoBae = ({
    // @ts-ignore
    id, // @ts-ignore
    done, // @ts-ignore
    total,
    height = false,
    weight = false, // @ts-ignore
    onClick,
    loadingDisabled = false,
  }) => {
    const navigate = useNavigate();
    const handleClick = () => {
      if (!loadingDisabled) {
        if (done === 0) {
          onClickZero();
        } else {
          onClick();
        }
      }
    };

    const onClickZero = () => {
      if (id === "height") {
        navigate(`${path.babyHealth}`, {
          state: { chooseTab: 0, showModalHeight: true },
        });
      } else if (id === "weight") {
        navigate(`${path.babyHealth}`, {
          state: { chooseTab: 1, showModalWeight: true },
        });
      } else {
        onClick();
      }
    };
    return (
      <div
        className="flex flex-col items-center justify-center info-bae p-2 mb-[22px]"
        onClick={handleClick}
      >
        <p className="text-[9px] font-bold text-main">
          {id === 1
            ? "Vận động thô"
            : id === 2
              ? "Vận động tinh"
              : id === 3
                ? "Ngôn ngữ"
                : id === 4
                  ? " Tư duy IQ"
                  : id === 5
                    ? "Tự lập"
                    : id === 6
                      ? "Cảm xúc EQ"
                      : id === 7
                        ? "Giác quan"
                        : id === "height"
                          ? "Chiều cao"
                          : id === "weight"
                            ? "Cân nặng"
                            : ""}
        </p>
        <p
          className={`text-center text-[18px] font-extrabold 
        ${Number(roundedNumber(done / total)) < 1
              ? "text-[#FC2727]"
              : "text-[#14557a]"
            }
        `}
        >
          {total !== 0 ? `${roundedNumber((done / total) * 100)}%` : "0%"}
        </p>
        <p className="text-center text-[8px] font-semibold  text-main">
          {"( "}
          {done} / {total}&nbsp;
          {height && "cm "}
          {weight && "kg "}
          {")"}
        </p>
      </div>
    );
  };
  return (
    <div className="flex flex-col w-full h-full bg-[#F7F8FD] relative">
      {/* header  */}
      <div className="bg-main pt-14 pb-4 flex">
        <div
          className="flex items-center px-2"
          // @ts-ignore
          onClick={() => refListBaby.current?.setShow(true)}
        >
          <img
            src={selectedBaby?.image ? selectedBaby.image : Images.iconBaby}
            className="w-11 h-11 object-cover rounded-full"
          />
          <div className="ml-2">
            <div className="flex items-center">
              <p className="text-[15px] mr-1 font-semibold text-white">
                {selectedBaby?.name}
              </p>
              <svg width="14" height="10" viewBox="0 0 12 8" fill="none">
                <path
                  d="M9 1L5 5L1 1"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-[11px] font-semibold text-white">
              {/*// @ts-ignore*/}
              {showAgeByMonth(selectedBaby?.realAge) || "0 tuổi"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 w-full pt-0  bg-[#-[#F7F8FD] mt-[-1px] overflow-x-scroll">
        {/* slide */}
        <div className="px-2 relative mb-8">
          {!!dataBannerHome &&
            !!dataBannerHome.data &&
            !!dataBannerHome.data.data &&
            dataBannerHome.data.data.length === 1 && (
              <img
                src={`${API_URL_IMAGE}${dataBannerHome.data.data[0].image}`}
                className="w-full h-[150px] object-cover rounded-2xl"
              />
            )}
          {!!dataBannerHome &&
            !!dataBannerHome.data &&
            !!dataBannerHome.data.data &&
            dataBannerHome.data.data.length > 1 && (
              <Swiper autoplay duration={2000} loop>
                {dataBannerHome.data.data.map((item, index) => {
                  return (
                    <Swiper.Slide key={index}>
                      <img
                        src={`${API_URL_IMAGE}${item.image}`}
                        className="w-full h-[150px] object-cover rounded-2xl"
                      />
                    </Swiper.Slide>
                  );
                })}
              </Swiper>
            )}
          <div className="py-2 absolute bottom-[-15%] left-[50%] justify-center -translate-x-1/2 z-10 w-[85%] px-8 mx-auto shadow-[0px_5px_10px_0px_rgba(0,_0,_0,_0.05)] bg-main flex rounded-md">
            <div>
              <span className="text-sm text-white">Tổng điểm tích</span>
              <div className="flex items-center justify-center">
                {!!dataPointHome &&
                  !!dataPointHome.data &&
                  !!dataPointHome.data.data &&
                  !!dataPointHome?.data?.data?.point ? (
                  <p className="text-xs font-bold text-[#ffc303] mr-1">
                    {formatDecimalNumber(dataPointHome?.data?.data?.point)}
                  </p>
                ) : (
                  <p className="text-xs font-bold text-[#ffc303] mr-1">0</p>
                )}
                <p className="text-xs font-bold text-[#ffc303]">Point</p>
              </div>
            </div>
            <div className="flex items-center mr-3 justify-center">
              <div className="w-[1px] bg-white h-full mx-3"></div>
              <svg width="30" height="28" viewBox="0 0 30 28" fill="none">
                <g clipPath="url(#clip0_1414_2753)">
                  <path
                    d="M14.5752 0C6.59583 0 0 6.25078 0 13.9453C0 21.6398 6.59583 28 14.5752 28C22.5546 28 29.037 21.6398 29.037 13.9453C29.037 6.25078 22.5546 0 14.5752 0Z"
                    fill="#FEDB41"
                  />
                  <path
                    d="M29.037 13.9453C29.037 21.6398 22.5546 28 14.5752 28V0C22.5546 0 29.037 6.25078 29.037 13.9453Z"
                    fill="#FFCC33"
                  />
                  <path
                    d="M14.5753 3.28125C8.4842 3.28125 3.40283 8.07182 3.40283 13.9453C3.40283 19.8188 8.4842 24.7188 14.5753 24.7188C20.6664 24.7188 25.6343 19.8188 25.6343 13.9453C25.6343 8.07182 20.6664 3.28125 14.5753 3.28125Z"
                    fill="#FEA832"
                  />
                  <path
                    d="M25.6342 13.9453C25.6342 19.8188 20.6663 24.7188 14.5752 24.7188V3.28125C20.6663 3.28125 25.6342 8.07182 25.6342 13.9453Z"
                    fill="#FE9923"
                  />
                  <path
                    d="M16.2765 13.125H15.4258V9.84375H16.2765C16.753 9.84375 17.1272 10.2046 17.1272 10.6641C17.1272 11.7468 18.8286 11.7468 18.8286 10.6641C18.8286 9.30229 17.6888 8.20312 16.2765 8.20312H15.4258V7.38281C15.4258 6.84135 15.0005 6.5625 14.5752 6.5625C14.1498 6.5625 13.7245 6.84135 13.7245 7.38281V8.20312H12.7603C11.3481 8.20312 10.2083 9.30229 10.2083 10.6641V12.3047C10.2083 13.6665 11.3481 14.7656 12.7603 14.7656H13.7245V18.1562H12.7603C12.2839 18.1562 11.9096 17.7954 11.9096 17.3359C11.9096 16.2532 10.2083 16.2532 10.2083 17.3359C10.2083 18.6977 11.3481 19.7969 12.7603 19.7969H13.7245V20.6172C13.7245 21.1586 14.1498 21.4375 14.5752 21.4375C15.0005 21.4375 15.4258 21.1586 15.4258 20.6172V19.7969H16.2765C17.6888 19.7969 18.8286 18.6977 18.8286 17.3359V15.5859C18.8286 14.2242 17.6888 13.125 16.2765 13.125ZM13.7245 13.125H12.7603C12.2839 13.125 11.9096 12.7641 11.9096 12.3047V10.6641C11.9096 10.2046 12.2839 9.84375 12.7603 9.84375H13.7245V13.125ZM17.1272 17.3359C17.1272 17.7954 16.753 18.1562 16.2765 18.1562H15.4258V14.7656H16.2765C16.753 14.7656 17.1272 15.1265 17.1272 15.5859V17.3359Z"
                    fill="#FEDB41"
                  />
                  <path
                    d="M16.2766 13.125H15.4259V9.84375H16.2766C16.753 9.84375 17.1273 10.2046 17.1273 10.6641C17.1273 11.7468 18.8287 11.7468 18.8287 10.6641C18.8287 9.30229 17.6889 8.20312 16.2766 8.20312H15.4259V7.38281C15.4259 6.84135 15.0005 6.5625 14.5752 6.5625V21.4375C15.0005 21.4375 15.4259 21.1586 15.4259 20.6172V19.7969H16.2766C17.6889 19.7969 18.8287 18.6977 18.8287 17.3359V15.5859C18.8287 14.2242 17.6889 13.125 16.2766 13.125ZM17.1273 17.3359C17.1273 17.7954 16.753 18.1562 16.2766 18.1562H15.4259V14.7656H16.2766C16.753 14.7656 17.1273 15.1265 17.1273 15.5859V17.3359Z"
                    fill="#FFCC33"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1414_2753">
                    <rect width="29.037" height="28" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div
              className="flex flex-col items-center"
              onClick={() => navigate(path.voucher)}
            >
              <span className="text-sm text-white">Voucher</span>
              <div className=" flex items-center justify-center">
                <p className="text-xs font-bold text-[#ffc303] mr-1 italic">
                  {formatDecimalNumber(cacupoint())}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center px-3 pt-3">
          <img src={Images.boxShapeBrownBlack} className="w-[35px] h-1" />
          <span className="paytoneOne text-center text-[15px] font-extrabold text-main w-60 line-clamp-1">
            Hồ sơ sức khoẻ : {selectedBaby?.name}
          </span>
          <img
            src={Images.boxShapeBrownBlack}
            className="w-[35px] h-1 rotate-180"
          />
        </div>
        <div className="flex items-center justify-between px-2 pt-3">
          <div className="">
            <InfoBae
              id="height"
              done={height ? `${height}` : 0}
              total={heightWHO ? `${heightWHO}` : 0}
              height
              onClick={() => {
                if (
                  heightWHO === 0 ||
                  heightWHO === null ||
                  heightWHO === undefined
                ) {
                  setShowAlert2(true);
                } else {
                  navigate(`${path.babyHealth}`, {
                    state: { chooseTab: 0, showModalHeight: false },
                  });
                }
              }}
            />
            <InfoBae
              id="weight"
              done={weight ? `${weight}` : 0}
              total={weightWHO ? `${weightWHO}` : 0}
              weight
              onClick={() => {
                if (
                  weightWHO === 0 ||
                  weightWHO === null ||
                  weightWHO === undefined
                ) {
                  setShowAlert2(true);
                } else {
                  navigate(`${path.babyHealth}`, {
                    state: { chooseTab: 1, showModalWeight: false },
                  });
                }
              }}
            />
            <InfoBae
              id={1}
              // @ts-ignore
              done={grossMotor?.done ? `${grossMotor?.done}` : 0}
              // @ts-ignore
              total={grossMotor?.total ? `${grossMotor?.total}` : 0}
              onClick={() => {
                if (
                  // @ts-ignore
                  grossMotor?.total === undefined ||
                  // @ts-ignore
                  grossMotor?.total === 0 ||
                  // @ts-ignore
                  grossMotor?.total === null
                ) {
                  setShowAlert2(true);
                } else {
                  navigate("/parameters", { state: grossMotor });
                }
              }}
              loadingDisabled={loadingIndex}
            />
            <InfoBae
              id={2}
              // @ts-ignore
              done={fineMotor?.done ? `${fineMotor?.done}` : 0}
              // @ts-ignore
              total={fineMotor?.total ? `${fineMotor?.total}` : 0}
              onClick={() => {
                if (
                  // @ts-ignore
                  fineMotor?.total === 0 ||
                  // @ts-ignore
                  fineMotor?.total === null ||
                  // @ts-ignore
                  fineMotor?.total === undefined
                ) {
                  setShowAlert2(true);
                } else {
                  navigate("/parameters", { state: fineMotor });
                }
              }}
              loadingDisabled={loadingIndex}
            />
          </div>
          <div className="flex flex-col items-center">
            <div className="h-[271px] flex justify-center items-center">
              <img
                src={Images.babey}
                className="w-[199px] h-auto object-contain "
              />
            </div>
            <InfoBae
              id={5}
              // @ts-ignore
              done={independent?.done ? `${independent?.done}` : 0}
              // @ts-ignore
              total={independent?.total ? `${independent?.total}` : 0}
              // onClick={() => navigate("/parameters", { state: independent })}
              onClick={() => {
                if (
                  // @ts-ignore
                  independent?.total === 0 ||
                  // @ts-ignore
                  independent?.total === null ||
                  // @ts-ignorev
                  independent?.total === undefined
                ) {
                  setShowAlert2(true);
                } else {
                  navigate("/parameters", { state: independent });
                }
              }}
              loadingDisabled={loadingIndex}
            />
          </div>
          <div className="">
            <InfoBae
              id={6}
              // @ts-ignore
              done={socialEmotions?.done ? `${socialEmotions?.done}` : 0}
              // @ts-ignore
              total={socialEmotions?.total ? `${socialEmotions?.total}` : 0}
              onClick={() => {
                if (
                  // @ts-ignore
                  socialEmotions?.total === 0 ||
                  // @ts-ignore
                  socialEmotions?.total === null ||
                  // @ts-ignore
                  socialEmotions?.total === undefined
                ) {
                  setShowAlert2(true);
                } else {
                  navigate("/parameters", { state: socialEmotions });
                }
              }}
              loadingDisabled={loadingIndex}
            />
            <InfoBae
              id={4}
              // @ts-ignore
              done={awareness?.done ? `${awareness?.done}` : 0}
              // @ts-ignore
              total={awareness?.total ? `${awareness?.total}` : 0}
              onClick={() => {
                if (
                  // @ts-ignore
                  awareness?.total === 0 ||
                  // @ts-ignore
                  awareness?.total === null ||
                  // @ts-ignore
                  awareness?.total === undefined
                ) {
                  setShowAlert2(true);
                } else {
                  navigate("/parameters", { state: awareness });
                }
              }}
              loadingDisabled={loadingIndex}
            />

            <InfoBae
              id={3}
              // @ts-ignore
              done={language?.done ? `${language?.done}` : 0}
              // @ts-ignore
              total={language?.total ? `${language?.total}` : 0}
              onClick={() => {
                if (
                  // @ts-ignore
                  language?.total === 0 ||
                  // @ts-ignore
                  language?.total === null ||
                  // @ts-ignore
                  language?.total === undefined
                ) {
                  setShowAlert2(true);
                } else {
                  navigate("/parameters", { state: language });
                }
              }}
              loadingDisabled={loadingIndex}
            />
            <InfoBae
              id={7}
              // @ts-ignore
              done={sense?.done ? `${sense?.done}` : 0}
              // @ts-ignore
              total={sense?.total ? `${sense?.total}` : 0}
              onClick={() => {
                if (
                  // @ts-ignore
                  sense?.total === 0 ||
                  // @ts-ignore
                  sense?.total === null ||
                  // @ts-ignore
                  sense?.total === undefined
                ) {
                  setShowAlert2(true);
                } else {
                  navigate("/parameters", { state: sense });
                }
              }}
              loadingDisabled={loadingIndex}
            />
          </div>
        </div>
        <div className="w-full">
          <p className="text-main text-[10px] italic text-center mx-3 ">
            Các chỉ số trong hồ sơ sức khoẻ được xây dựng theo chương trình đo
            lường phát triển ASQ-3 của ĐH Oregon Hoa Kỳ
          </p>
        </div>
        <LessonHome />
        <div className="px-2 py-4 bg-[#f7f8DF]">
          {/* danh mục  */}
          <div className="grid grid-cols-5 bg-white rounded-xl p-2 items-start justify-center">
            {!!listAccess &&
              !!listAccess.length &&
              listAccess?.map((item, i) => {
                return (
                  <div
                    className="flex flex-col items-center justify-center"
                    key={i}
                    onClick={() => {
                      if (item.screen === "") {
                        setShowAlert(true);
                      } else if (
                        item.screen === "/askDoctor" ||
                        item.screen === path.community
                      ) {
                        setShowAlert(true);
                      } else {
                        navigate(item.screen);
                      }
                    }}
                  >
                    <img src={item.icon} className="w-11 h-11 object-contain" />
                    <div
                      className="text-[#828282] font-bold text-[11px] text-center mb-2 mt-1"
                      dangerouslySetInnerHTML={{ __html: item.title }}
                    ></div>
                  </div>
                );
              })}
          </div>
          {!!listProblem && !!listProblem.length && (
            <div className="bg-white rounded-xl my-4">
              {/*// @ts-ignore*/}
              <TitleHome
                icon={Images.iconBurn}
                title={`Vấn đề thường gặp của bé: ${selectedBaby?.name}`}
              />
              <div className="px-2  pb-4 w-full  flex flex-col">
                <div
                  className="w-full items-center h-[150px]  rounded-lg mt-2 "
                  style={{
                    backgroundImage: `url(${Images.bannerProblem})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100%",
                  }}
                >
                  <div className="w-[50%] float-right h-[130px] flex items-center justify-center mt-[5%] mr-[1%]">
                    <div>
                      <p className="text-xs font-bold text-main font-['Nunito'] leading-[5px] text-center  ">
                        Giai đoạn
                      </p>
                      <p className="text-base font-bold text-center font-['Nunito'] text-red-300 z-10 ">
                        {selectedBaby?.realAge === 0
                          ? "dưới 4 tuần"
                          : `tháng ${selectedBaby?.realAge}`}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" grid grid-cols-5 bg-white rounded-xl gap-2 mt-2 items-start justify-between">
                  {!!listProblem &&
                    !!listProblem.length &&
                    listProblem?.map((item, i) => {
                      return (
                        <div
                          className="flex flex-col items-center justify-center "
                          key={i}
                          onClick={() => {
                            navigate(path.lisPostWithProblem, { state: item });
                          }}
                        >
                          <div className="bg-main rounded-[50%]">
                            <img
                              src={`${API_URL_IMAGE}${item.icon}`}
                              className="w-11 h-11 object-contain rounded-[50%]"
                            />
                          </div>

                          <p className="text-[#828282] font-bold text-[11px] text-center mb-2 mt-1">
                            {item?.name}
                          </p>
                        </div>
                      );
                    })}
                </div>
                {page < lastPage ? (
                  <div
                    className="bg-main flex flex-col items-center w-full justify-center py-2 rounded-lg mt-4"
                    onClick={() => [setPage(page + 1)]}
                  >
                    <div className="text-sm font-['Nunito'] font-bold text-center text-white ">
                      Xem thêm
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                <div className="w-full flex items-center justify-center my-2">
                  <button
                    className="w-full  bg-main rounded-[10px] py-2 mx-auto shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"
                    onClick={() => {
                      setModal2(true);
                    }}
                  >
                    <span className="text-sm font-['Nunito'] font-bold text-center text-white">
                      Tìm kiếm vấn đề thường gặp của bé{" "}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* hồ sơ sức khỏe  */}
          <div className="bg-white rounded-xl my-4">
            <TitleHome
              icon={Images.iconBurn}
              title="Nuôi con khoa học"
              titleMore="Truy cập"
              onClick={() => navigate(path.profile)}
            />
            <div className="px-2 pb-4">
              <img
                src={Images.bannerHelthBaby}
                className="w-full h-auto my-2 rounded-lg"
              />
              <ListHealthHome />
              <div
                className="bg-main flex flex-col items-center w-full justify-center py-2 rounded-lg mt-4"
                onClick={() => navigate(path.profile)}
              >
                <div className="text-sm font-['Nunito'] font-bold text-center text-white">
                  Truy cập
                </div>
              </div>
            </div>
          </div>
          {/* sản phẩm theo các vấn đề  */}
          <div className="bg-white rounded-xl my-4">
            <TitleHome
              icon={Images.iconBurn}
              title="Sản phẩm theo các vấn đề"
              titleMore="Truy cập"
              isShowMore
            />
            <div className="grid grid-cols-5 bg-white rounded-xl px-2 pt-4 pb-3 items-start justify-center">
              {!!listProductAccordingProblem &&
                !!listProductAccordingProblem.length &&
                listProductAccordingProblem?.map((item, i) => {
                  if (i >= 10) return;
                  return (
                    <div
                      className="flex flex-col items-center justify-center"
                      key={i}
                      onClick={() =>
                        navigate("/detailProblem", { state: item })
                      }
                    >
                      <img
                        src={`${API_URL_IMAGE}${item.image}`}
                        className="w-11 h-11 object-contain"
                      />
                      <div
                        className="text-[#828282] font-bold text-[11px] text-center mb-2 mt-1"
                        dangerouslySetInnerHTML={{ __html: item.title }}
                      ></div>
                    </div>
                  );
                })}
            </div>
            <div className="w-full flex items-center justify-center my-2">
              <button
                className="w-[95%] bg-main rounded-[10px] py-2 mx-auto shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] mb-2"
                onClick={() => {
                  setModal(true);
                }}
              >
                <span className="text-sm font-['Nunito'] font-bold text-center text-white">
                  Tìm kiếm sản phẩm theo các vấn đề
                </span>
              </button>
            </div>
          </div>
          {/* shopping  */}
          {!!dataListShoppingHome &&
            !!dataListShoppingHome.data &&
            !!dataListShoppingHome?.data.data &&
            !!dataListShoppingHome.data.data.length &&
            dataListShoppingHome.data.data.map((item, index) => {
              return (
                <div className="bg-white rounded-xl my-4" key={index}>
                  <TitleHome
                    icon={
                      item.icon
                        ? `${API_URL_IMAGE}${item.icon}`
                        : Images.iconoBottleMilk
                    }
                    title={item.name}
                    titleMore="Xem thêm"
                    onClick={() => navigate(path.listProduct, { state: item })}
                  />
                  <div>
                    <div className="px-2 pb-4">
                      <img
                        src={
                          item.banner
                            ? `${API_URL_IMAGE}${item.banner}`
                            : Images.bannerDrinkHome
                        }
                        className="w-full h-auto my-2 rounded-md"
                      />
                      {!!item &&
                        !!item.product &&
                        !!item.product.length &&
                        item.product.map((element, i) => {
                          if (i > 2) return;
                          return (
                            <ItemProductHome
                              item={element}
                              key={element.id}
                              i={i}
                              onClickPlus={(event) => {
                                event.stopPropagation();
                                setItemProductChoose(element);
                                // @ts-ignore
                                refModalAddProduct.current?.setShowModalAddProduct(
                                  true
                                );
                              }}
                            />
                          );
                        })}
                      <BtnAccessHome
                        onClick={() =>
                          navigate(path.listProduct, { state: item })
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          {/* cộng đồng  */}
          {/* <div className="bg-white rouded-xl my-4 overflow-hidden">
            <div className="flex items-center pl-2 rounded-t-xl">
              <img
                className="w-4 h-4 object-contain"
                src={Images.iconPenHome}
              />
              <p className="text-sm font-['Paytone One'] px-2 font-bold flex-1 text-white w-full">
                Cộng đồng
              </p>
              <div className=" py-2 pl-4 pr-2">
                <span className="text-[#626262] text-xs font-normal">
                  xem thêm {">"}
                </span>
              </div>
            </div>
            {!!dataVideoHome &&
              !!dataVideoHome.data &&
              !!dataVideoHome.data.data &&
              !!dataVideoHome.data.data.data &&
              !!dataVideoHome.data.data.data.length &&
              dataVideoHome.data.data.data.map((item, i) => {
                return (
                  <div key={item.id}>
                    <ItemVideoBlog item={item} />
                  </div>
                );
              })}
          </div> */}
        </div>
        <div className="h-36"></div>
        <ShowListBaby ref={refListBaby} />
      </div>
      <ShowListBaby ref={refListBaby} />
      {/*// @ts-ignore*/}
      <ModalAddProduct ref={refModalAddProduct} item={itemProductChoose} />
      {modal ? <ModalSearch setModal={setModal} /> : null}
      {modal2 ? (
        <ModalSearchKey setModal={setModal2} month={selectedBaby?.realAge} />
      ) : null}
      {showAlert === true ? (
        <ModaNotify
          description={"Chức năng đang phát triển"}
          setPopupVisible={setShowAlert}
          popupVisible={showAlert}
        />
      ) : null}
      {showAlert2 === true ? (
        <ModaNotify
          description={"Không có bài tập"}
          setPopupVisible={setShowAlert2}
          popupVisible={showAlert2}
        />
      ) : null}
      {/* {showFollow && <CareOA onHandleFollow={saveFollowOA} />} */}
    </div>
  );
};
export default Home;

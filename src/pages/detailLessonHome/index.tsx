import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import homeApi from "../../apis/home.apis";
import Images from "../../static";
import { Modal, Page, useSnackbar } from "zmp-ui";
import {
  icCheckWhiteBox,
  icCheckGrayBox,
  icDanger,
  icDangerGray,
  icPaperPlane,
  icPaperPlaneGray,
} from "./icon";
import { AppContext } from "../../contexts/app.context";
import { convertTimeByFormat, showAgeByMonth } from "../../module";
import moment from "moment";
import { dataStatic } from "../../constants/data";
import { checkBgIconObject } from "../../utils/checkBgIcon";
import {
  closebtnIcon,
  heartIcon,
  heartRedIcon,
  redbabyface,
  warningIcon,
} from "../../utils/iconSvgNew";
import LessonDetailInfo from "./lessonDetailInfo";
import ModalToy from "./modalToy";
import LessonToy from "./lessonToy";
import {urldt} from "../../api";

const URL_VIDEO_DEFAULT =
  "https://linokids.net/storage/videos/0435666a902ebef0b8816c9a8dea094a863718.mp4";

const DetailLessonHome = () => {
  const location = useLocation();
  const id = location.state.key;
  const { selectedBaby } = useContext(AppContext);
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [selectBtnTop, setSelectBtnTop] = React.useState("");
  const [showModalInfo, setShowModalInfo] = React.useState(false);
  const [isLiked, setIsLiked] = React.useState(false);
  const refModalToy = React.useRef(null);
  const [isPausedVideo, setIsPausedVideo] = React.useState(false);
  const arrCategory = dataStatic.listLesson;
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const videoRef = React.useRef(null);
  const [isError, setIsError] = React.useState(false);
  const [routes] = React.useState([
    {
      key: "info",
      title: "Thông tin bài tập",
    },
    {
      key: "toy",
      title: "Đồ chơi",
    },
  ]);
  const [videoLink, setVideoLink] = React.useState("");
  const dateNow = () => {
    return moment(new Date(Date.now()));
  };

  const { data: dataLesson } = useQuery({
    queryKey: ["dataLesson", id],
    queryFn: () => {
      return homeApi.getDetailLessonHome(id);
    },

    onSuccess: (data) => {
      // @ts-ignore
      var url = data?.data?.data?.video;
      // @ts-ignore
      var newVideo = url.replace(urldt, "linokids.net");
      setVideoLink(newVideo);
      setSelectBtnTop(location.state.status);
      setIsLiked(
        location.state.like &&
          (location.state.like === 1 || location.state.like)
          ? true
          : false
      );
    },
    enabled: Boolean(id),
  });
  const handleVideoError = () => {
    setVideoLink(URL_VIDEO_DEFAULT);
  };

  const handleVideoClick = () => {
    if (!isPausedVideo) {
      // @ts-ignore
      videoRef.current?.pause();
    } else {
      // @ts-ignore
      videoRef.current?.play();
    }
    setIsPausedVideo(!isPausedVideo);
  };
  const updateStatusLesson = async (
    statusParams: "completed" | "easily" | "hard"
  ) => {
    const res = await homeApi.updateStatusLesson(
      // @ts-ignore
      dataLesson?.data.data.id,
      selectedBaby?.id,
      statusParams,
      location.state.dateTime
        ? convertTimeByFormat(location.state.dateTime, "YYYY-MM-DD")
        : dateNow().format("YYYY-MM-DD")
    );
    if (res.data.code === 200) {
      openSnackbar({
        position: "top",

        text: "Cập nhật trạng thái thành công",
        verticalAction: true,
        type: "success",
        icon: true,
        duration: 1500,
      });
    } else {
      openSnackbar({
        position: "top",

        text: res.data?.message,
        verticalAction: true,
        type: "error",
        icon: true,
        duration: 1500,
      });
    }
  };
  const selectStatus = (
    selectBtnTopParams: "completed" | "easily" | "hard"
  ) => {
    try {
      if (selectBtnTop === selectBtnTopParams) return;
      setSelectBtnTop(selectBtnTopParams);
      updateStatusLesson(selectBtnTopParams);
    } catch (error) {
      console.log(error);
    }
  };
  const clickLike = () => {
    try {
      setIsLiked((prev) => !prev);
      handleLike();
    } catch (error) {
      console.log(error);
    }
  };
  const handleLike = async () => {
    try {
      const res = await homeApi.likeLesson(
        // @ts-ignore
        dataLesson?.data.data.id,
        selectedBaby?.id,
        isLiked
      );
    } catch (error) {
      console.log(error);
    }
  };
  const renderHeaderInfo = () => {
    const cateCurrent = dataLesson?.data.data.category_id
      ? arrCategory[
          arrCategory.findIndex(
            (x) => x.id === dataLesson?.data.data.category_id
          )
        ].name
      : "";
    const iconCurrent = dataLesson?.data.data.category_id
      ? checkBgIconObject(dataLesson?.data.data.category_id).smallIcon
      : redbabyface;
    return (
      <div className="mx-2 my-1">
        <div className="flex items-center">
          <div className="flex items-center flex-1">
            {iconCurrent}
            <span className="ml-2 text-sm text-black font-normal">
              {cateCurrent}
            </span>
          </div>
          <div className="flex items-center">
            <div className="mr-3" onClick={() => clickLike()}>
              {isLiked ? heartRedIcon : heartIcon}
            </div>
            <div className="px-1" onClick={() => setShowModalInfo(true)}>
              {warningIcon}
            </div>
          </div>
        </div>
        <p className="font-semibold text-black line-clamp-2 text-base my-1">
          {dataLesson?.data?.data?.name}
        </p>
        <div className="h-[1px] bg-blue w-full my-4" />
      </div>
    );
  };
  const renderTabbar = () => {
    return (
      <div className="flex items-center mx-2 px-2 rounded-t-2xl -mt-1">
        {!!routes &&
          routes.map((item, index) => {
            let bgColor = item.key === "info" ? "#F26091" : "#e23795";
            return (
              <div
                key={index}
                onClick={() => setCurrentIndex(index)}
                className="flex-1 justify-center items-center py-2 rounded-t-lg  shadow-sm"
                style={{
                  backgroundColor: currentIndex === index ? bgColor : "#FFFFFF",
                }}
              >
                <p
                  className="font-semibold text-center line-clamp-1 text-base "
                  style={{
                    color: currentIndex === index ? "#ffffff" : "#828282",
                  }}
                >
                  {item.title}
                </p>
              </div>
            );
          })}
      </div>
    );
  };
  return (
    <div className="w-full h-full bg-white relative">
      {/* header  */}
      <div
        className="bg-main pt-14 pb-4"
        style={{
          backgroundImage: `url(${Images.bgHeader})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      >
        {/* header  */}
        <div className="flex items-center ">
          <div className="relative">
            <div
              className="w-12 h-12 flex items-center justify-center"
              onClick={() => navigate(-1)}
            >
              <div className="w-9 h-9 bg-white ml-3 rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20.9999 11H6.41394L11.7069 5.70703L10.2929 4.29303L2.58594 12L10.2929 19.707L11.7069 18.293L6.41394 13H20.9999V11Z"
                    fill="#333333"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col items-center justify-center pr-12">
            <div className="flex items-center">
              <p className="text-center ptext-base  font-bold p text-white p">
                {selectedBaby?.name}
              </p>
              <img
                src={Images.iconArrowDownWhite}
                className="w-3 h-4 object-contain ml-2"
              />
            </div>
            <p className="text-center text-xs  text-white">
              {/*// @ts-ignore*/}
              {showAgeByMonth(selectedBaby?.realAge) || "0 tuổi"}
            </p>
          </div>
        </div>
      </div>
      {dataLesson && (
        <Page className="w-full h-full pb-32" hideScrollbar>
          <div onClick={handleVideoClick} className="relative">
            <video
              src={videoLink}
              controls={false}
              className="w-full h-auto"
              autoPlay={true}
              ref={videoRef}
              playsInline
              // onError={() => handleVideoError()}
            />
            {isPausedVideo && (
              <div className="absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 z-10">
                <img src={Images.iconPlay} className="w-14 h-14" />
              </div>
            )}
            {isError && (
              <div className="absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 z-10">
                <p className="text-xs text-[#828282]">Không thể phát video</p>
              </div>
            )}
          </div>
          {/* 3 button trạng thái  */}
          <div>
            {location.state.isBelongProgess && !location.state.status ? (
              <div className="flex items-center px-4 pt-4 pb-2"></div>
            ) : (
              <div className=" px-2 pt-4 pb-2 grid grid-cols-3 items-center gap-2">
                {/* btn1  */}
                <div
                  className="rounded-2xl flex items-center justify-center py-2"
                  style={{
                    backgroundColor:
                      selectBtnTop === "completed" ? "#e23795" : "#DEDEDE",
                  }}
                  onClick={() => selectStatus("completed")}
                >
                  {selectBtnTop === "completed"
                    ? icCheckWhiteBox
                    : icCheckGrayBox}
                  <p
                    className="text-sm font-normal ml-1"
                    style={{
                      color:
                        selectBtnTop === "completed" ? "#ffffff" : "#828282",
                    }}
                  >
                    Hoàn thành
                  </p>
                </div>
                {/* btn2 */}
                <div
                  className="rounded-2xl flex items-center justify-center py-2"
                  style={{
                    backgroundColor:
                      selectBtnTop === "easily" ? "#e23795" : "#DEDEDE",
                  }}
                  onClick={() => selectStatus("easily")}
                >
                  {selectBtnTop === "easily" ? icPaperPlane : icPaperPlaneGray}
                  <p
                    className="text-sm font-normal ml-1"
                    style={{
                      color: selectBtnTop === "easily" ? "#ffffff" : "#828282",
                    }}
                  >
                    Dễ dàng
                  </p>
                </div>
                {/* btn3 */}
                <div
                  className="rounded-2xl flex items-center justify-center py-2"
                  style={{
                    backgroundColor:
                      selectBtnTop === "hard" ? "#e23795" : "#DEDEDE",
                  }}
                  onClick={() => selectStatus("hard")}
                >
                  {selectBtnTop === "hard" ? icDanger : icDangerGray}
                  <p
                    className="text-sm font-normal ml-1"
                    style={{
                      color: selectBtnTop === "hard" ? "#ffffff" : "#828282",
                    }}
                  >
                    Khó khăn
                  </p>
                </div>
              </div>
            )}
          </div>
          {renderHeaderInfo()}
          {renderTabbar()}
          {currentIndex === 0 ? (
            <LessonDetailInfo
              info={dataLesson?.data.data}
              // @ts-ignore
              showModal={() => refModalToy.current?.setShowModalToy(true)}
            />
          ) : (
            <LessonToy
              // @ts-ignore
              showModal={() => refModalToy.current?.setShowModalToy(true)}
              // @ts-ignore
              arrToys={dataLesson?.data.data.toys}
            />
          )}

          <Modal
            visible={showModalInfo}
            onClose={() => {
              setShowModalInfo(false);
            }}
            // title="Ghi chú"
          >
            <div className="w-full h-full flex flex-col min-h-[150px] no-scrollbar">
              <div className="flex items-center w-full">
                <p className="text-base text-black flex-1 text-center ml-12 font-normal">
                  Ghi chú
                </p>
                <div onClick={() => setShowModalInfo(false)}>
                  {closebtnIcon}
                </div>
              </div>
              <div>
                <p className="text-xs text-black font-normal">
                  {dataLesson?.data?.data?.note}
                </p>
              </div>
            </div>
          </Modal>
        </Page>
      )}
      <ModalToy ref={refModalToy} />
    </div>
  );
};
export default DetailLessonHome;

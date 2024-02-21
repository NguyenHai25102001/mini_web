import React, { useEffect } from "react";
import { List, Modal, Page } from "zmp-ui";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";
import API, {urldt} from "../../../api";
import { checkBgIconObject } from "../../../utils/checkBgIcon";
import Utilities, { checkBgIconColor } from "../../../utils/Utilities";
import { checkIconByCatePara } from "./checkIconPara";
import profileApi from "../../../apis/profile.apis";
import { convertTimeByFormat } from "../../../module";
import { useNavigate } from "react-router-dom";
import path from "../../../constants/path";

// @ts-ignore

const DetailParameters = ({
  // @ts-ignore
  data,
  // @ts-ignore
  isOpenVd,
  // @ts-ignore
  handleSetIdListVideo, // @ts-ignore
  updateMileston, // @ts-ignore
  checkMilesIsDone, // @ts-ignore
  selectedBaby, // @ts-ignore
  idCategory, // @ts-ignore
  accessToken, // @ts-ignore
  state,
}) => {
  const navigate = useNavigate();
  const [popupVisible, setPopupVisible] = React.useState(false);
  const [dataAction, setDataAction] = React.useState<String>("");
  const [choose, setChoose] = React.useState<String>("");
  const [dataTimeDoneMileston, setDataTimeDoneMileston] = React.useState(null);
  // @ts-ignore
  const getTimeMilestoneDone = async (id_activity_milestones) => {
    try {
      let formData = new FormData();
      formData.append("id_activity_milestones", id_activity_milestones);
      formData.append("id_user_profiles", selectedBaby.id);
      const res = await axios({
        url: API.getTimeDoneMileston(),
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.data.status) {
        setDataTimeDoneMileston(res.data.data);
      }
    } catch (error) {
      console.log("Lỗi Cập nhật status milestones theo id ! ");
      console.log(error);
    }
  };
  const check = () => {
    let title = "";
    if (idCategory === 111111) {
      title = "Vận động thô";
    } else if (idCategory === 222222) {
      title = "Vận động tinh";
    } else if (idCategory === 333333) {
      title = "Ngôn ngữ";
    } else if (idCategory === 444444) {
      title = "Nhận thức";
    } else if (idCategory === 555555) {
      title = "Tự lập";
    } else if (idCategory === 666666) {
      title = "Cảm xúc xã hội";
    } else if (idCategory === 777777) {
      title = "Giác quan";
    }
    return title;
  };
  const getHealthRecord = async () => {
    try {
      let formData = new FormData();
      formData.append("id_month", `${selectedBaby?.realAge}`);
      formData.append("id_user_profiles", `${selectedBaby?.id}`);
      const res = await profileApi.getHealthRecord(formData);
      if (res.status) {
        setChoose(res.data.data[state.id_category].category);
      } else {
        alert("Có lỗi xảy ra");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!!selectedBaby) {
      getHealthRecord();
    }
  }, [state, selectedBaby]);

  return (
    <Page className="w-full h-full bg-white pb-52 px-2" hideScrollbar>
      <div className="bg-main w-full rounded-[30px] flex items-center my-2 py-2 px-2">
        <div className="bg-gradient-to-b w-[80%] from-[#AEE9FC] to-main mx-4 px-4 rounded-[25px] py-2">
          <div className="flex items-center justify-center mb-1">
            {checkIconByCatePara(idCategory)?.bigIcon}
            <div className="h-[35px] flex items-center justify-center ml-1">
              {choose && (
                <span className="text-main mt-2 text-center text-xl font-normal">
                  {/*// @ts-ignore*/}
                  {choose.done}/{choose.total}
                </span>
              )}
            </div>
          </div>
          <p className="text-sm font-semibold text-center text-[#FFFFFF]">
            {check()}
          </p>
        </div>
        <span className="text-white font-bold text-base">
          Thông tin các bài tập kỹ năng giúp trẻ đạt được các cột mốc theo tháng{" "}
          {selectedBaby?.realAge}
        </span>
      </div>
      {/* Danh sách các vận động */}
      <div className="w-full px-2">
        <List>
          {!!data &&
            !!data.length &&
            // @ts-ignore
            data.map((item, index) => {
              return (
                <div key={index}>
                  {/*// @ts-ignore*/}
                  {item?.milestones?.map((item2, index2) => {
                    return (
                      <div
                        key={index2}
                        className="w-full border-main border-solid rounded-xl border-2  mb-4 shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] "
                      >
                        <div className="flex items-center  py-2  px-2  ">
                          <div className="w-4 h-4  ">
                            {!checkMilesIsDone(item2.id) ? (
                              <svg
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-square"
                                viewBox="0 0 16 16"
                                onClick={() => {
                                  updateMileston(item2.id, 1);
                                }}
                              >
                                <path
                                  d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
                                  stroke="#D7D7D7"
                                />
                              </svg>
                            ) : (
                              <svg
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-check-square"
                                viewBox="0 0 16 16"
                                onClick={() => {
                                  updateMileston(item2.id, 0);
                                }}
                              >
                                <path
                                  d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
                                  stroke="#D7D7D7"
                                />
                                <path
                                  d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"
                                  stroke="#D7D7D7"
                                />
                              </svg>
                            )}
                          </div>
                          <span className="text-black font-normal text-sm line-clamp-2 ml-2">
                            {item2.title}
                          </span>
                        </div>
                        {`${item.id}` + `${item2.id}` === isOpenVd ? (
                          <Swiper
                            slidesPerView={1.5}
                            spaceBetween={12}
                            style={{ paddingLeft: 4, paddingRight: 4 }}
                          >
                            {!!item2?.video &&
                              // @ts-ignore
                              item2?.video?.map((action, actionIndex) => {
                                var url = action?.detai_video?.image;
                                var newUrl = url.replace(
                                  urldt,
                                  "linokids.net"
                                );
                                return (
                                  <SwiperSlide
                                    key={actionIndex}
                                    className="flex flex-col justify-center items-center mr-3 border-[1px] border-solid border-sky-500"
                                  >
                                    <div
                                      className="w-full"
                                      onClick={() =>
                                        navigate(path.detailLessonHome, {
                                          state: {
                                            key: action.id_video,
                                            dateTime: convertTimeByFormat(
                                              action.detai_video?.created_at,
                                              "YYYY-MM-DD"
                                            ),
                                          },
                                        })
                                      }
                                    >
                                      <img
                                        src={newUrl}
                                        alt="alt text here"
                                        className=" w-full h-[89px] object-cover"
                                      />
                                      <div className="flex items-center p-[2px] px-2 ">
                                        <div className="w-10 h-10 relative mr-2 ">
                                          {
                                            checkBgIconObject(item2.id_category)
                                              .bigbg
                                          }
                                        </div>

                                        <div>
                                          <p
                                            className=" text-[13px] font-normal"
                                            style={{
                                              color: "#D86B90",
                                            }}
                                          >
                                            {item.name}
                                          </p>
                                          <p className="text-[#000] font-normal text-[15px] line-clamp-1">
                                            {action?.detai_video?.name}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </SwiperSlide>
                                );
                              })}
                          </Swiper>
                        ) : (
                          <></>
                        )}

                        <div className="w-full flex items-center justify-center mt-3 border-t-2 border-[#C2EDFF]  ">
                          <div
                            className="w-[50%] h-[100%] flex items-center justify-evenly"
                            onClick={() =>
                              handleSetIdListVideo(item.id, item2.id)
                            }
                          >
                            {item2?.video?.length > 0 &&
                            item.id + `${item2.id}` === isOpenVd ? (
                              <svg
                                fill="currentColor"
                                viewBox="0 0 16 16"
                                className="w-[20px] h-[12px] object-contain"
                              >
                                <path
                                  fillRule="evenodd"
                                  stroke="#e23795"
                                  d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
                                />
                              </svg>
                            ) : (
                              <svg
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="w-[20px] h-[12px] object-contain "
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                                />
                              </svg>
                            )}
                            {item2?.video?.length > 0 && (
                              <span
                                style={
                                  item.id + `${item2.id}` === isOpenVd
                                    ? { color: "#e23795" }
                                    : { color: "#D86B90" }
                                }
                                className="text-[13px] font-semibold pr-1"
                              >
                                Các hoạt động liên quan
                              </span>
                            )}
                            {item2?.video?.length === 0 && (
                              <span
                                className="text-[13px] font-semibold pr-1"
                                style={{ color: "#D86B90" }}
                              >
                                Cột mốc không có video
                              </span>
                            )}
                          </div>
                          <div
                            className="w-[50%] h-full flex items-center justify-evenly border-l-2  border-solid py-1 "
                            style={{
                              borderLeftColor: "#D86B90",
                            }}
                            onClick={() => {
                              setPopupVisible(true);
                              setDataAction(item2?.title);
                              getTimeMilestoneDone(item2?.id);
                            }}
                          >
                            <svg
                              width="25"
                              height="25"
                              viewBox="0 0 25 25"
                              fill="none"
                            >
                              <path
                                d="M8.48214 1.17188C8.48214 0.522461 7.88504 0 7.14286 0C6.40067 0 5.80357 0.522461 5.80357 1.17188V3.125H3.57143C1.60156 3.125 0 4.52637 0 6.25V7.03125V9.375V21.875C0 23.5986 1.60156 25 3.57143 25H21.4286C23.3984 25 25 23.5986 25 21.875V9.375V7.03125V6.25C25 4.52637 23.3984 3.125 21.4286 3.125H19.1964V1.17188C19.1964 0.522461 18.5993 0 17.8571 0C17.115 0 16.5179 0.522461 16.5179 1.17188V3.125H8.48214V1.17188ZM2.67857 9.375H7.14286V12.1094H2.67857V9.375ZM2.67857 14.4531H7.14286V17.5781H2.67857V14.4531ZM9.82143 14.4531H15.1786V17.5781H9.82143V14.4531ZM17.8571 14.4531H22.3214V17.5781H17.8571V14.4531ZM22.3214 12.1094H17.8571V9.375H22.3214V12.1094ZM22.3214 19.9219V21.875C22.3214 22.3047 21.9196 22.6562 21.4286 22.6562H17.8571V19.9219H22.3214ZM15.1786 19.9219V22.6562H9.82143V19.9219H15.1786ZM7.14286 19.9219V22.6562H3.57143C3.08036 22.6562 2.67857 22.3047 2.67857 21.875V19.9219H7.14286ZM15.1786 12.1094H9.82143V9.375H15.1786V12.1094Z"
                                fill="black"
                                fillOpacity={0.25}
                              />
                            </svg>
                            {checkMilesIsDone(item2.id) ? (
                              <div>
                                <p
                                  className="text-[13px] font-semibold"
                                  style={{ color: "#D86B90" }}
                                >
                                  Đã hoàn thành
                                </p>
                              </div>
                            ) : (
                              <div>
                                <p
                                  className="text-[13px] font-semibold"
                                  style={{ color: "#D86B90" }}
                                >
                                  Chưa đạt được
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </List>
      </div>
      <Modal
        visible={popupVisible}
        title="Thông tin về cột mốc hoàn thành"
        modalStyle={{
          fontSize: 12,
        }}
        onClose={() => {
          setPopupVisible(false);
        }}
        // @ts-ignore
        description={dataAction}
        modalClassName="modal-parameters"
      >
        <div className="h-[0px] w-full border-dashed border-blue-600 border-t-[2px]	mt-2" />
        <p className="text-center font-semibold text-sm text-blue-400 my-3">
          Dấu mốc thời gian hoàn thành
        </p>
        <div className="border-[1px] border-blue-600 border-solid rounded-[10px] mx-auto w-[65%] flex items-center justify-center mb-3 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]">
          <span className="font-semibold text-black text-xl m-2 py-2">
            {Utilities.formatDateString(dataTimeDoneMileston)}
          </span>
        </div>
        <div
          className="w-[80%] bg-blue-400 text-white text-base text-center mx-auto py-2 rounded-xl mt-4"
          onClick={() => {
            setPopupVisible(!popupVisible);
          }}
        >
          Đóng
        </div>
      </Modal>
    </Page>
  );
};

export default DetailParameters;

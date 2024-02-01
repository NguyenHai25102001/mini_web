import React, { useContext, useState } from "react";
import { DatePicker, Sheet, useSnackbar } from "zmp-ui";
import { FEMALE_IMAGE, MALE_IMAGE } from "../../constants/utils";
import "./styles.css";
import moment from "moment";
import {
  BabyUpdateModel,
  CreateBabyConfig,
  IBaby,
} from "../../types/user.type";
import { AppContext } from "../../contexts/app.context";
import profileApi from "../../apis/profileC.apis";
import { saveListBabyToLS } from "../../utils/auth";
import InputBaby from "../addBaby/inputBaby";
import { dataFamily } from "../addBaby/family";
import { useLocation, useNavigate } from "react-router-dom";
import profileApiC from "../../apis/profileC.apis";
const EditBaby = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const itemBaby: IBaby = location.state.item;
  const type: number = location.state.type; //1 edit 2 add
  const { profile, setProfile, setListBaby, setSelectedBaby } =
    useContext(AppContext);
  const [avatar, setAvatar] = React.useState<string>("");
  const [gender, setGender] = React.useState<"male" | "female" | string>(
    "male"
  );
  const [babyId, setBabyId] = React.useState(null);
  const [name, setName] = React.useState<string>("");
  const [dayChoose, setDayChoose] = useState(
    type === 1 ? new Date(itemBaby?.dob) : ""
  );
  const [isEarly, setIsEarly] = useState<boolean>(false);
  const [monthEarly, setMonthEarly] = useState<string | number>(0);
  const [weight, setWeight] = useState<string | number>("");
  const [height, setHeight] = useState<string | number>("");
  const [position, setPosition] = useState<{
    id: string | null;
    value: string;
  }>({
    id: "",
    value: "",
  });

  const [sheetVisible, setSheetVisible] = useState(false);

  const { openSnackbar } = useSnackbar();
  const checkEmpty = () => {
    try {
      if (name.length === 0) {
        openSnackbar({
          position: "top",

          text: "Không được bỏ trống tên bé",
          verticalAction: true,
          type: "default",
          icon: true,
          duration: 1500,
        });
        return false;
      }
      if (!dayChoose) {
        openSnackbar({
          position: "top",

          text: "Không được bỏ trống ngày sinh",
          verticalAction: true,
          type: "default",
          icon: true,
          duration: 1500,
        });
        return false;
      }
      // if (isEarly) {
      //   if (Number(monthEarly) === 0 || !monthEarly) {
      //     openSnackbar({
      //       position: "top",

      //       text: "Bé của bạn sinh non? Vui lòng điền số tuần sinh non của bé",
      //       verticalAction: true,
      //       type: "default",
      //       icon: true,
      //       duration: 1500,
      //     });
      //     return false;
      //   }
      // }
      // if (!weight) {
      //   openSnackbar({
      //     position: "top",

      //     text: "Hãy điền cân nặng của bé",
      //     verticalAction: true,
      //     type: "default",
      //     icon: true,
      //     duration: 1500,
      //   });
      //   return false;
      // }
      // if (!height) {
      //   openSnackbar({
      //     position: "top",

      //     text: "Hãy điền chiều cao của bé",
      //     verticalAction: true,
      //     type: "default",
      //     icon: true,
      //     duration: 1500,
      //   });
      //   return false;
      // }
      return true;
    } catch (error) {
      // Utilities.log(error);
      return false;
    }
  };
  const getProfile = async (name: string) => {
    try {
      const res = await profileApiC.getUserProfile();
      setProfile(res.data.data.user);
      setListBaby(res.data.data.baby);
      saveListBabyToLS(res.data.data.baby);

      const filteredList = res.data.data.baby.filter(
        (item) => item.name === name
      );
      console.log(filteredList[0]);
      setSelectedBaby(filteredList[0]);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEdit = async () => {
    if (checkEmpty()) {
      const objBaby: BabyUpdateModel = {
        // @ts-ignore
        user_id: profile.id,
        name,
        dob: moment(dayChoose).utcOffset(7).format("YYYY-MM-DD"),
        // @ts-ignore
        gender,
        image: avatar.length > 0 ? avatar : null,
        isEarly,
        earlyAge: isEarly ? Number(monthEarly) : 0,
        // @ts-ignore
        pamily: position.id || null,
        weight: Number(weight),
        height: Number(height),
      };

      try {
        // @ts-ignore
        const res = await profileApiC.editBaby(babyId, objBaby);
        if (res.data.code === 200) {
          const res = await profileApiC.getUserProfile();
          setProfile(res.data.data.user);
          setListBaby(res.data.data.baby);
          saveListBabyToLS(res.data.data.baby);
          navigate(-1);

          getProfile(name);
          openSnackbar({
            position: "top",

            text: "Cập nhật thành công",
            verticalAction: true,
            type: "default",
            icon: true,
            duration: 2500,
          });
        } else {
          alert("Cập nhật thất bại");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      return;
    }
  };

  const handleAddBaby = async () => {
    if (checkEmpty()) {
      const objBaby: CreateBabyConfig = {
        // @ts-ignore
        user_id: profile?.id,
        name,
        dob: moment(dayChoose).utcOffset(7).format("YYYY-MM-DD"),
        // @ts-ignore
        gender,
        image: avatar.length > 0 ? avatar : null,
        isEarly,
        earlyAge: isEarly ? Number(monthEarly) : 0,
        pamily: position.id || null,
        weight: Number(weight),
        height: Number(height),
      };
      try {
        const res = await profileApiC.createBaby(objBaby);
        if (res.data.code === 200) {
          const res = await profileApiC.getUserProfile();
          setProfile(res.data.data.user);
          setListBaby(res.data.data.baby);
          saveListBabyToLS(res.data.data.baby);
          setSelectedBaby(res.data.data.baby[res.data.data.baby.length - 1]);
          navigate(-1);
          openSnackbar({
            position: "top",

            text: "Thêm thành công",
            verticalAction: true,
            type: "default",
            icon: true,
            duration: 2500,
          });
        } else {
          alert("Tạo thất bại");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      return;
    }
  };

  const onConfirm = () => {
    console.log("type", type);
    if (type === 1) {
      handleEdit();
    } else {
      handleAddBaby();
    }
  };
  const setDataInit = () => {
    try {
      // @ts-ignore
      setBabyId(itemBaby?.id);
      setAvatar(itemBaby?.image);
      setGender(itemBaby?.gender);
      setName(itemBaby?.name);
      setDayChoose(new Date(itemBaby?.dob));
      setIsEarly(itemBaby?.isEarly === 0 ? false : true);
      setMonthEarly(itemBaby?.earlyAge || "0");
      setWeight(itemBaby?.weight);
      setHeight(itemBaby?.height);
      setPosition(
        dataFamily[dataFamily.findIndex((x) => x.id === itemBaby?.pamily)]
      );
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    if (type && type === 1) {
      setDataInit();
    }
  }, [type]);
  const onDelete = async () => {
    try {
      // @ts-ignore
      const res = await profileApiC.deleteBaby(babyId);
      if (res.data.code === 200) {
        const res = await profileApiC.getUserProfile();
        setProfile(res.data.data.user);
        setListBaby(res.data.data.baby);
        saveListBabyToLS(res.data.data.baby);
        setSelectedBaby(res.data.data.baby[0]);
        navigate(-1);
        openSnackbar({
          position: "top",

          text: "Xoá thành công",
          verticalAction: true,
          type: "default",
          icon: true,
          duration: 2500,
        });
      } else {
        navigate(-1);
        openSnackbar({
          position: "top",

          text: "Xoá thất bại",
          verticalAction: true,
          type: "default",
          icon: true,
          duration: 2500,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="absolute z-[99] p-0 m-0 w-full h-full flex flex-cols items-center justify-center bg-[#222222]">
      <div className="w-full flex flex-col h-full rounded-xl bg-main">
        <div className="flex pt-14 pb-4">
          <div className="px-4" onClick={() => navigate(-1)}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M13.5892 8.3999L8.40869 13.5804"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.5907 13.5834L8.40588 8.39746"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.6854 1H6.31351C3.04757 1 1 3.31243 1 6.58486V15.4151C1 18.6876 3.03784 21 6.31351 21H15.6843C18.9611 21 21 18.6876 21 15.4151V6.58486C21 3.31243 18.9611 1 15.6854 1Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="pr-14 flex-1 flex flex-col items-center justify-center">
            <p className="text-lg font-bold text-white text-center uppercase">
              {type === 1 ? "Chỉnh sửa thông tin bé" : "Thêm bé"}
            </p>
            <p className="text-lg font-medium text-white text-center">
              {type === 1 ? itemBaby?.name : "Cập nhật thông tin bé"}
            </p>
          </div>
        </div>
        <div className="flex-1 bg-white overflow-y-auto no-scrollbar rounded-t-xl -mt-1">
          <div className="h-full w-[75%] mx-auto">
            <div className="pt-6 flex items-center w-full">
              <div
                className="relative flex-1"
                onClick={() => {
                  // changeAvatar();
                }}
              >
                <img
                  src={
                    avatar
                      ? avatar
                      : gender === "male"
                      ? MALE_IMAGE
                      : FEMALE_IMAGE
                  }
                  className="w-32 h-32 rounded-2xl object-cover"
                />
                <div className="absolute w-full  flex items-center justify-center bottom-0 rounded-2xl bg-white bg-opacity-60 py-1">
                  <p className="text-main text-sm font-normal">
                    {"Mặc định theo bé"}
                  </p>
                </div>
              </div>
              {/* avatar và giới tính  */}
              <div className="flex-1 pl-5">
                <div
                  onClick={() => setGender("male")}
                  className=" flex items-center justify-center rounded-2xl mb-4 py-2 "
                  style={{
                    backgroundColor: gender === "male" ? "#e23795" : "#DEDEDE",
                  }}
                >
                  {gender === "male" ? (
                    <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                      <path
                        d="M5.45282 8.00195V8.62152C5.45282 8.78332 5.58399 8.91449 5.74579 8.91449C5.90762 8.91449 6.03876 8.78332 6.03876 8.62152V8.00195C6.03876 7.84016 5.90762 7.70898 5.74579 7.70898C5.58399 7.70898 5.45282 7.84016 5.45282 8.00195Z"
                        fill="#ffffff"
                      />
                      <path
                        d="M12.1945 7.70898C12.0327 7.70898 11.9015 7.84016 11.9015 8.00195V8.62152C11.9015 8.78332 12.0327 8.91449 12.1945 8.91449C12.3563 8.91449 12.4875 8.78332 12.4875 8.62152V8.00195C12.4875 7.84016 12.3563 7.70898 12.1945 7.70898Z"
                        fill="#ffffff"
                      />
                      <path
                        d="M9.59933 8.41064C9.44051 8.59291 9.21117 8.69744 8.97012 8.69744C8.72906 8.69744 8.49973 8.5929 8.3409 8.41068C8.23461 8.28869 8.04957 8.27599 7.92754 8.38228C7.80555 8.48857 7.79285 8.67365 7.89914 8.79564C8.1693 9.10564 8.55961 9.28341 8.97012 9.28341C9.38058 9.28341 9.7709 9.10564 10.0411 8.79568C10.1474 8.67369 10.1347 8.48865 10.0127 8.38232C9.8907 8.27599 9.70566 8.28869 9.59933 8.41064Z"
                        fill="#ffffff"
                      />
                      <path
                        d="M14.607 2.15758C13.0538 0.76625 11.0519 0 8.97016 0C7.31746 0 5.715 0.479336 4.33594 1.38613C4.20074 1.47504 4.16324 1.65668 4.25211 1.79188C4.34098 1.92707 4.5227 1.96465 4.65785 1.8757C5.94105 1.03191 7.43223 0.585938 8.97016 0.585938C10.9074 0.585938 12.7704 1.29906 14.216 2.59402C15.4807 3.72691 16.3402 5.2241 16.679 6.8641C16.4048 6.73414 16.0916 6.66039 15.7841 6.65391C15.6015 6.16043 15.2106 5.74559 14.6925 5.5427C13.7187 5.16145 12.7093 4.25816 12.1571 3.455C12.0374 3.27836 11.7723 3.28438 11.6623 3.47047C10.8929 4.77395 9.43387 5.47645 7.94484 5.7102C8.43059 4.71105 8.00414 3.57141 7.98215 3.51426C7.90355 3.31 7.63309 3.25961 7.4875 3.42734C6.54688 4.51051 5.09672 5.05031 3.68973 5.26531C2.93441 5.38074 2.32996 5.93191 2.14332 6.65426C1.8484 6.66211 1.53879 6.73266 1.26121 6.86418C1.60262 5.21148 2.47215 3.70527 3.75293 2.56898C3.87395 2.4616 3.885 2.27645 3.77766 2.15539C3.67027 2.03437 3.48512 2.02328 3.36406 2.13066C1.83004 3.49168 0.845664 5.34723 0.584062 7.36473C0.221797 7.75758 0 8.2818 0 8.85703C0 10.1472 1.11109 11.1713 2.40805 11.0507C3.02914 12.6074 4.1909 13.8969 5.65695 14.6836C4.43406 15.8079 3.58734 17.5841 3.58734 19.707C3.58734 19.8688 3.71852 20 3.88031 20H14.06C14.2219 20 14.353 19.8688 14.353 19.707C14.353 17.6068 13.5205 15.8249 12.2896 14.6894C12.8252 14.4036 13.3264 14.0469 13.7802 13.6242C13.8986 13.5139 13.9052 13.3286 13.7949 13.2102C13.6846 13.0918 13.4993 13.0852 13.3808 13.1955C12.0398 14.4445 10.3025 15.0193 8.59629 14.9204C4.56105 14.6874 1.65539 10.7779 2.71281 6.79262C2.84488 6.29516 3.26328 5.9232 3.77828 5.84449C5.14918 5.63492 6.5368 5.13629 7.55211 4.20023C7.62516 4.66133 7.62609 5.36187 7.12707 5.86086C6.9448 6.04316 7.06996 6.36316 7.33957 6.36094C7.77445 6.35293 8.51453 6.23602 9.18527 6.01906C10.2741 5.66695 11.2586 5.05121 11.9318 4.12621C12.5995 4.94637 13.4979 5.70418 14.4789 6.08828C15.175 6.36082 15.2811 7.0159 15.2833 7.02027C15.6945 8.76246 15.3405 10.7691 14.1337 12.3623C14.036 12.4913 14.0613 12.675 14.1903 12.7727C14.3193 12.8704 14.503 12.8451 14.6007 12.7161C14.9923 12.1991 15.3063 11.6402 15.5393 11.0512C17.5482 11.231 18.7109 8.83363 17.3563 7.36465C17.0965 5.36164 16.123 3.51562 14.607 2.15758ZM11.2221 15.1501V16.107H9.26313V15.5109C9.95492 15.4827 10.6175 15.354 11.2221 15.1501ZM13.5093 17.8004H11.808V16.6929H13.071C13.2522 17.045 13.3988 17.4143 13.5093 17.8004ZM11.2221 17.8004H9.26313V16.6929H11.2221V17.8004ZM4.86934 16.6929H6.13227V17.8005H4.43098C4.54156 17.4143 4.68809 17.045 4.86934 16.6929ZM6.7182 16.6929H8.67719V17.8005H6.7182V16.6929ZM6.7182 15.1471C7.34977 15.3617 8.00562 15.4832 8.67719 15.5106V16.107H6.7182V15.1471ZM8.67719 18.3864V19.4141H6.7182V18.3864H8.67719ZM9.26313 18.3864H11.2221V19.4141H9.26313V18.3864ZM6.13227 15.045V16.107H5.21418C5.50254 15.675 5.81746 15.3209 6.13227 15.045ZM4.29328 18.3864H6.13227V19.4141H4.17879C4.19223 19.0609 4.23105 18.7184 4.29328 18.3864ZM11.808 19.4141V18.3864H13.647C13.7092 18.7184 13.748 19.0609 13.7615 19.4141H11.808ZM12.7261 16.107H11.808V15.045C12.1196 15.3181 12.4369 15.6732 12.7261 16.107ZM2.20621 10.4747C0.731601 10.4747 0.0355469 8.6707 1.09957 7.67566C1.12395 7.65898 1.44523 7.31699 2.01387 7.25078C1.83387 8.29562 1.88492 9.40508 2.20621 10.4747ZM15.7386 10.4746C16.0562 9.40563 16.1055 8.28602 15.9266 7.25082C16.7304 7.34426 17.3543 8.03066 17.3543 8.85703C17.3543 9.7484 16.6296 10.4736 15.7386 10.4746Z"
                        fill="#ffffff"
                      />
                    </svg>
                  ) : (
                    <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                      <path
                        d="M5.45282 8.00195V8.62152C5.45282 8.78332 5.58399 8.91449 5.74579 8.91449C5.90762 8.91449 6.03876 8.78332 6.03876 8.62152V8.00195C6.03876 7.84016 5.90762 7.70898 5.74579 7.70898C5.58399 7.70898 5.45282 7.84016 5.45282 8.00195Z"
                        fill="gray"
                      />
                      <path
                        d="M12.1945 7.70898C12.0327 7.70898 11.9015 7.84016 11.9015 8.00195V8.62152C11.9015 8.78332 12.0327 8.91449 12.1945 8.91449C12.3563 8.91449 12.4875 8.78332 12.4875 8.62152V8.00195C12.4875 7.84016 12.3563 7.70898 12.1945 7.70898Z"
                        fill="gray"
                      />
                      <path
                        d="M9.59933 8.41064C9.44051 8.59291 9.21117 8.69744 8.97012 8.69744C8.72906 8.69744 8.49973 8.5929 8.3409 8.41068C8.23461 8.28869 8.04957 8.27599 7.92754 8.38228C7.80555 8.48857 7.79285 8.67365 7.89914 8.79564C8.1693 9.10564 8.55961 9.28341 8.97012 9.28341C9.38058 9.28341 9.7709 9.10564 10.0411 8.79568C10.1474 8.67369 10.1347 8.48865 10.0127 8.38232C9.8907 8.27599 9.70566 8.28869 9.59933 8.41064Z"
                        fill="gray"
                      />
                      <path
                        d="M14.607 2.15758C13.0538 0.76625 11.0519 0 8.97016 0C7.31746 0 5.715 0.479336 4.33594 1.38613C4.20074 1.47504 4.16324 1.65668 4.25211 1.79188C4.34098 1.92707 4.5227 1.96465 4.65785 1.8757C5.94105 1.03191 7.43223 0.585938 8.97016 0.585938C10.9074 0.585938 12.7704 1.29906 14.216 2.59402C15.4807 3.72691 16.3402 5.2241 16.679 6.8641C16.4048 6.73414 16.0916 6.66039 15.7841 6.65391C15.6015 6.16043 15.2106 5.74559 14.6925 5.5427C13.7187 5.16145 12.7093 4.25816 12.1571 3.455C12.0374 3.27836 11.7723 3.28438 11.6623 3.47047C10.8929 4.77395 9.43387 5.47645 7.94484 5.7102C8.43059 4.71105 8.00414 3.57141 7.98215 3.51426C7.90355 3.31 7.63309 3.25961 7.4875 3.42734C6.54688 4.51051 5.09672 5.05031 3.68973 5.26531C2.93441 5.38074 2.32996 5.93191 2.14332 6.65426C1.8484 6.66211 1.53879 6.73266 1.26121 6.86418C1.60262 5.21148 2.47215 3.70527 3.75293 2.56898C3.87395 2.4616 3.885 2.27645 3.77766 2.15539C3.67027 2.03437 3.48512 2.02328 3.36406 2.13066C1.83004 3.49168 0.845664 5.34723 0.584062 7.36473C0.221797 7.75758 0 8.2818 0 8.85703C0 10.1472 1.11109 11.1713 2.40805 11.0507C3.02914 12.6074 4.1909 13.8969 5.65695 14.6836C4.43406 15.8079 3.58734 17.5841 3.58734 19.707C3.58734 19.8688 3.71852 20 3.88031 20H14.06C14.2219 20 14.353 19.8688 14.353 19.707C14.353 17.6068 13.5205 15.8249 12.2896 14.6894C12.8252 14.4036 13.3264 14.0469 13.7802 13.6242C13.8986 13.5139 13.9052 13.3286 13.7949 13.2102C13.6846 13.0918 13.4993 13.0852 13.3808 13.1955C12.0398 14.4445 10.3025 15.0193 8.59629 14.9204C4.56105 14.6874 1.65539 10.7779 2.71281 6.79262C2.84488 6.29516 3.26328 5.9232 3.77828 5.84449C5.14918 5.63492 6.5368 5.13629 7.55211 4.20023C7.62516 4.66133 7.62609 5.36187 7.12707 5.86086C6.9448 6.04316 7.06996 6.36316 7.33957 6.36094C7.77445 6.35293 8.51453 6.23602 9.18527 6.01906C10.2741 5.66695 11.2586 5.05121 11.9318 4.12621C12.5995 4.94637 13.4979 5.70418 14.4789 6.08828C15.175 6.36082 15.2811 7.0159 15.2833 7.02027C15.6945 8.76246 15.3405 10.7691 14.1337 12.3623C14.036 12.4913 14.0613 12.675 14.1903 12.7727C14.3193 12.8704 14.503 12.8451 14.6007 12.7161C14.9923 12.1991 15.3063 11.6402 15.5393 11.0512C17.5482 11.231 18.7109 8.83363 17.3563 7.36465C17.0965 5.36164 16.123 3.51562 14.607 2.15758ZM11.2221 15.1501V16.107H9.26313V15.5109C9.95492 15.4827 10.6175 15.354 11.2221 15.1501ZM13.5093 17.8004H11.808V16.6929H13.071C13.2522 17.045 13.3988 17.4143 13.5093 17.8004ZM11.2221 17.8004H9.26313V16.6929H11.2221V17.8004ZM4.86934 16.6929H6.13227V17.8005H4.43098C4.54156 17.4143 4.68809 17.045 4.86934 16.6929ZM6.7182 16.6929H8.67719V17.8005H6.7182V16.6929ZM6.7182 15.1471C7.34977 15.3617 8.00562 15.4832 8.67719 15.5106V16.107H6.7182V15.1471ZM8.67719 18.3864V19.4141H6.7182V18.3864H8.67719ZM9.26313 18.3864H11.2221V19.4141H9.26313V18.3864ZM6.13227 15.045V16.107H5.21418C5.50254 15.675 5.81746 15.3209 6.13227 15.045ZM4.29328 18.3864H6.13227V19.4141H4.17879C4.19223 19.0609 4.23105 18.7184 4.29328 18.3864ZM11.808 19.4141V18.3864H13.647C13.7092 18.7184 13.748 19.0609 13.7615 19.4141H11.808ZM12.7261 16.107H11.808V15.045C12.1196 15.3181 12.4369 15.6732 12.7261 16.107ZM2.20621 10.4747C0.731601 10.4747 0.0355469 8.6707 1.09957 7.67566C1.12395 7.65898 1.44523 7.31699 2.01387 7.25078C1.83387 8.29562 1.88492 9.40508 2.20621 10.4747ZM15.7386 10.4746C16.0562 9.40563 16.1055 8.28602 15.9266 7.25082C16.7304 7.34426 17.3543 8.03066 17.3543 8.85703C17.3543 9.7484 16.6296 10.4736 15.7386 10.4746Z"
                        fill="gray"
                      />
                    </svg>
                  )}
                  <span
                    className="text-sm font-normal ml-2"
                    style={{ color: gender === "male" ? "#ffffff" : "#828282" }}
                  >
                    Bé trai
                  </span>
                </div>
                <div
                  onClick={() => setGender("female")}
                  className=" flex items-center justify-center mt-4 rounded-2xl py-2"
                  style={{
                    backgroundColor:
                      gender === "female" ? "#e23795" : "#DEDEDE",
                  }}
                >
                  {gender === "female" ? (
                    <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                      <path
                        d="M5.5291 8.65266C5.70128 8.65266 5.84086 8.52149 5.84086 8.35969V7.73297C5.84086 7.57117 5.70128 7.44 5.5291 7.44C5.35693 7.44 5.21735 7.57117 5.21735 7.73297V8.35969C5.21735 8.52149 5.35693 8.65266 5.5291 8.65266Z"
                        fill="#ffffff"
                      />
                      <path
                        d="M12.4706 8.65266C12.6428 8.65266 12.7824 8.52149 12.7824 8.35969V7.73297C12.7824 7.57117 12.6428 7.44 12.4706 7.44C12.2985 7.44 12.1589 7.57117 12.1589 7.73297V8.35969C12.1589 8.52149 12.2984 8.65266 12.4706 8.65266Z"
                        fill="#ffffff"
                      />
                      <path
                        d="M8.99984 9.02572C9.44062 9.02572 9.85979 8.84631 10.1499 8.53349C10.263 8.4115 10.2495 8.22646 10.1197 8.12013C9.98986 8.01384 9.79291 8.02654 9.6798 8.14853C9.32041 8.53611 8.68027 8.53728 8.31979 8.14853C8.20669 8.02654 8.00974 8.01384 7.87992 8.12013C7.75011 8.22642 7.7366 8.4115 7.8497 8.53349C8.13989 8.84631 8.55905 9.02572 8.99984 9.02572Z"
                        fill="#ffffff"
                      />
                      <path
                        d="M17.9996 8.45774C17.9996 6.09703 16.9595 3.87891 15.1412 2.28117C15.0155 2.1707 14.8182 2.17688 14.7006 2.29508C14.5829 2.41328 14.5896 2.59867 14.7153 2.70918C16.4036 4.19258 17.376 6.25453 17.376 8.45774C17.3782 14.0333 17.4564 15.2626 14.0413 16.6632C13.6549 15.8783 13.1148 15.1937 12.5343 14.6906C15.1951 13.3539 16.7419 10.6714 16.4843 7.84832C16.4007 6.93277 15.744 6.15723 14.8113 5.8725C12.5003 5.16711 11.1871 5.20031 9.31157 2.8627V0.591289C10.9157 0.646641 12.4528 1.12891 13.7751 1.99445C13.9164 2.08691 14.1107 2.0543 14.2092 1.92152C14.3075 1.78875 14.2728 1.60613 14.1315 1.51367C12.6188 0.523398 10.8443 0 8.99985 0C4.03743 0 0.000169501 3.7941 0.000169501 8.45774L8.62524e-05 8.84148C-0.00186743 14.156 -0.00170143 15.6764 3.72363 17.2057C3.46055 17.8916 3.27196 18.7252 3.27196 19.707C3.27196 19.8688 3.41154 20 3.58372 20H14.4161C14.5883 20 14.7279 19.8688 14.7279 19.707C14.7279 18.7252 14.5393 17.8916 14.2762 17.2057C18.0954 15.6379 18.001 14.0713 17.9996 8.45774ZM12.6757 19.4141H5.32403C5.10123 17.8648 6.94924 16.9098 8.21959 17.797C8.68627 18.1232 9.31344 18.1232 9.78012 17.7971C11.0733 16.8939 12.9011 17.8927 12.6757 19.4141ZM9.97865 15.4577V17.0299C9.77734 17.1037 9.58579 17.2028 9.40805 17.3269C9.15939 17.5007 8.8303 17.4936 8.59158 17.3269C8.42335 17.2093 8.22774 17.1057 8.02106 17.03V15.4573C8.65252 15.5349 9.30987 15.5386 9.97865 15.4577ZM6.34892 15.0618C6.69796 15.1862 7.03474 15.2781 7.39759 15.3546V16.887C7.05678 16.8528 6.6911 16.8854 6.34892 16.9914V15.0618ZM10.6022 16.887V15.3567C10.96 15.284 11.3102 15.187 11.6508 15.0665V16.9913C11.3101 16.8858 10.9451 16.8528 10.6022 16.887ZM3.95832 16.6632C0.621024 15.2945 0.621647 14.0913 0.623559 8.84172L0.623642 8.45774C0.623642 4.21523 4.21317 0.745859 8.6881 0.591328V2.86266C6.87517 5.13922 5.55095 5.15133 3.18832 5.87246C2.25571 6.15719 1.59911 6.93238 1.51543 7.84746C1.36234 9.52402 1.83846 11.2016 2.92844 12.6048C3.04496 12.7549 3.27836 12.7661 3.41109 12.6291C3.50873 12.5283 3.52095 12.3736 3.43212 12.2593C2.431 10.9705 1.99629 9.43168 2.1367 7.89762C2.19835 7.22273 2.68319 6.64277 3.38099 6.42977C5.72071 5.71547 7.13438 5.66797 8.99985 3.44293C10.9189 5.73242 12.4518 5.76813 14.6187 6.42977C15.3096 6.64066 15.8007 7.215 15.8631 7.89836C16.1143 10.6489 14.4805 13.2352 11.8338 14.3595H11.8338C9.2715 15.4474 6.26067 14.9629 4.21729 13.1062C4.09329 12.9935 3.89572 12.997 3.77626 13.1134C3.65658 13.2297 3.65991 13.4152 3.7837 13.5276C4.27798 13.9768 4.84991 14.3727 5.47114 14.6857C4.87593 15.2 4.33867 15.8906 3.95832 16.6632ZM3.90129 19.4141C3.97175 17.675 4.6937 16.2527 5.72536 15.2719V17.2831C5.05126 17.7227 4.68268 18.4354 4.68268 19.1758C4.68405 19.2579 4.6863 19.3289 4.69573 19.4141H3.90129ZM13.304 19.4141C13.3951 18.579 13.0112 17.7636 12.2743 17.2831V15.2718C13.3354 16.2805 14.0296 17.7147 14.0984 19.4141H13.304Z"
                        fill="#ffffff"
                      />
                    </svg>
                  ) : (
                    <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                      <path
                        d="M5.5291 8.65266C5.70128 8.65266 5.84086 8.52149 5.84086 8.35969V7.73297C5.84086 7.57117 5.70128 7.44 5.5291 7.44C5.35693 7.44 5.21735 7.57117 5.21735 7.73297V8.35969C5.21735 8.52149 5.35693 8.65266 5.5291 8.65266Z"
                        fill="#828282"
                      />
                      <path
                        d="M12.4706 8.65266C12.6428 8.65266 12.7824 8.52149 12.7824 8.35969V7.73297C12.7824 7.57117 12.6428 7.44 12.4706 7.44C12.2985 7.44 12.1589 7.57117 12.1589 7.73297V8.35969C12.1589 8.52149 12.2984 8.65266 12.4706 8.65266Z"
                        fill="#828282"
                      />
                      <path
                        d="M8.99984 9.02572C9.44062 9.02572 9.85979 8.84631 10.1499 8.53349C10.263 8.4115 10.2495 8.22646 10.1197 8.12013C9.98986 8.01384 9.79291 8.02654 9.6798 8.14853C9.32041 8.53611 8.68027 8.53728 8.31979 8.14853C8.20669 8.02654 8.00974 8.01384 7.87992 8.12013C7.75011 8.22642 7.7366 8.4115 7.8497 8.53349C8.13989 8.84631 8.55905 9.02572 8.99984 9.02572Z"
                        fill="#828282"
                      />
                      <path
                        d="M17.9996 8.45774C17.9996 6.09703 16.9595 3.87891 15.1412 2.28117C15.0155 2.1707 14.8182 2.17688 14.7006 2.29508C14.5829 2.41328 14.5896 2.59867 14.7153 2.70918C16.4036 4.19258 17.376 6.25453 17.376 8.45774C17.3782 14.0333 17.4564 15.2626 14.0413 16.6632C13.6549 15.8783 13.1148 15.1937 12.5343 14.6906C15.1951 13.3539 16.7419 10.6714 16.4843 7.84832C16.4007 6.93277 15.744 6.15723 14.8113 5.8725C12.5003 5.16711 11.1871 5.20031 9.31157 2.8627V0.591289C10.9157 0.646641 12.4528 1.12891 13.7751 1.99445C13.9164 2.08691 14.1107 2.0543 14.2092 1.92152C14.3075 1.78875 14.2728 1.60613 14.1315 1.51367C12.6188 0.523398 10.8443 0 8.99985 0C4.03743 0 0.000169501 3.7941 0.000169501 8.45774L8.62524e-05 8.84148C-0.00186743 14.156 -0.00170143 15.6764 3.72363 17.2057C3.46055 17.8916 3.27196 18.7252 3.27196 19.707C3.27196 19.8688 3.41154 20 3.58372 20H14.4161C14.5883 20 14.7279 19.8688 14.7279 19.707C14.7279 18.7252 14.5393 17.8916 14.2762 17.2057C18.0954 15.6379 18.001 14.0713 17.9996 8.45774ZM12.6757 19.4141H5.32403C5.10123 17.8648 6.94924 16.9098 8.21959 17.797C8.68627 18.1232 9.31344 18.1232 9.78012 17.7971C11.0733 16.8939 12.9011 17.8927 12.6757 19.4141ZM9.97865 15.4577V17.0299C9.77734 17.1037 9.58579 17.2028 9.40805 17.3269C9.15939 17.5007 8.8303 17.4936 8.59158 17.3269C8.42335 17.2093 8.22774 17.1057 8.02106 17.03V15.4573C8.65252 15.5349 9.30987 15.5386 9.97865 15.4577ZM6.34892 15.0618C6.69796 15.1862 7.03474 15.2781 7.39759 15.3546V16.887C7.05678 16.8528 6.6911 16.8854 6.34892 16.9914V15.0618ZM10.6022 16.887V15.3567C10.96 15.284 11.3102 15.187 11.6508 15.0665V16.9913C11.3101 16.8858 10.9451 16.8528 10.6022 16.887ZM3.95832 16.6632C0.621024 15.2945 0.621647 14.0913 0.623559 8.84172L0.623642 8.45774C0.623642 4.21523 4.21317 0.745859 8.6881 0.591328V2.86266C6.87517 5.13922 5.55095 5.15133 3.18832 5.87246C2.25571 6.15719 1.59911 6.93238 1.51543 7.84746C1.36234 9.52402 1.83846 11.2016 2.92844 12.6048C3.04496 12.7549 3.27836 12.7661 3.41109 12.6291C3.50873 12.5283 3.52095 12.3736 3.43212 12.2593C2.431 10.9705 1.99629 9.43168 2.1367 7.89762C2.19835 7.22273 2.68319 6.64277 3.38099 6.42977C5.72071 5.71547 7.13438 5.66797 8.99985 3.44293C10.9189 5.73242 12.4518 5.76813 14.6187 6.42977C15.3096 6.64066 15.8007 7.215 15.8631 7.89836C16.1143 10.6489 14.4805 13.2352 11.8338 14.3595H11.8338C9.2715 15.4474 6.26067 14.9629 4.21729 13.1062C4.09329 12.9935 3.89572 12.997 3.77626 13.1134C3.65658 13.2297 3.65991 13.4152 3.7837 13.5276C4.27798 13.9768 4.84991 14.3727 5.47114 14.6857C4.87593 15.2 4.33867 15.8906 3.95832 16.6632ZM3.90129 19.4141C3.97175 17.675 4.6937 16.2527 5.72536 15.2719V17.2831C5.05126 17.7227 4.68268 18.4354 4.68268 19.1758C4.68405 19.2579 4.6863 19.3289 4.69573 19.4141H3.90129ZM13.304 19.4141C13.3951 18.579 13.0112 17.7636 12.2743 17.2831V15.2718C13.3354 16.2805 14.0296 17.7147 14.0984 19.4141H13.304Z"
                        fill="#828282"
                      />
                    </svg>
                  )}
                  <span
                    className="text-sm font-normal ml-2"
                    style={{
                      color: gender === "female" ? "#ffffff" : "#828282",
                    }}
                  >
                    Bé gái
                  </span>
                </div>
              </div>
            </div>
            {/* thông tin  */}
            <InputBaby
              title="Họ tên hoặc tên hay gọi của bé"
              placeHolder="Tên thường gọi của bé"
              value={name}
              onChange={(e) => setName(e.target.value)}
              max={30}
            />
            <p className="font-normal text-sm text-main my-2">
              Ngày tháng năm sinh của bé
            </p>
            <div className="flex items-center ">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g opacity="0.64">
                  <path
                    d="M17.9688 14.1406C18.4002 14.1406 18.75 13.7909 18.75 13.3594V10.4688C18.75 8.74562 17.3481 7.34375 15.625 7.34375H14.6861V4.58852C14.6861 2.0584 12.5832 0 9.99855 0C7.41387 0 5.31105 2.0584 5.31105 4.58852V7.34375H4.375C2.65188 7.34375 1.25 8.74562 1.25 10.4688V16.875C1.25 18.5981 2.65188 20 4.375 20H15.625C17.3481 20 18.75 18.5981 18.75 16.875C18.75 16.4435 18.4002 16.0938 17.9688 16.0938C17.5373 16.0938 17.1875 16.4435 17.1875 16.875C17.1875 17.7366 16.4866 18.4375 15.625 18.4375H4.375C3.51344 18.4375 2.8125 17.7366 2.8125 16.875V10.4688C2.8125 9.60719 3.51344 8.90625 4.375 8.90625H15.625C16.4866 8.90625 17.1875 9.60719 17.1875 10.4688V13.3594C17.1875 13.7909 17.5373 14.1406 17.9688 14.1406ZM13.1236 7.34375H6.87355V4.58852C6.87355 2.91996 8.27543 1.5625 9.99855 1.5625C11.7217 1.5625 13.1236 2.91996 13.1236 4.58852V7.34375Z"
                    fill="url(#paint0_linear)"
                  />
                  <path
                    d="M10 14.3359C10.4315 14.3359 10.7812 13.9862 10.7812 13.5547C10.7812 13.1232 10.4315 12.7734 10 12.7734C9.56853 12.7734 9.21875 13.1232 9.21875 13.5547C9.21875 13.9862 9.56853 14.3359 10 14.3359Z"
                    fill="url(#paint1_linear)"
                  />
                </g>
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#00B2FF" />
                    <stop offset="1" stopColor="#0085FF" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear"
                    x1="10"
                    y1="12.7734"
                    x2="10"
                    y2="14.3359"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#00B2FF" />
                    <stop offset="1" stopColor="#0085FF" />
                  </linearGradient>
                </defs>
              </svg>
              <DatePicker
                mask
                maskClosable
                dateFormat="dd/mm/yyyy"
                title="Chọn ngày sinh"
                suffix={<div />}
                // @ts-ignore
                value={dayChoose}
                locale="vi"
                endDate={new Date()}
                onChange={(date) => {
                  const selectedDate = date.toLocaleDateString("en-GB");
                  const dayStartSplit = selectedDate
                    .split("/")
                    .reverse()
                    .join("-");
                  setDayChoose(new Date(dayStartSplit));
                }}
              />
            </div>
            <div className="w-full h-[2px] bg-main mt-1"></div>

            <p className="font-normal text-sm text-main my-2">Bạn là:</p>
            <div
              className="flex items-center w-full"
              onClick={() => setSheetVisible(true)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g opacity="0.64">
                  <path
                    d="M17.9688 14.1406C18.4002 14.1406 18.75 13.7909 18.75 13.3594V10.4688C18.75 8.74562 17.3481 7.34375 15.625 7.34375H14.6861V4.58852C14.6861 2.0584 12.5832 0 9.99855 0C7.41387 0 5.31105 2.0584 5.31105 4.58852V7.34375H4.375C2.65188 7.34375 1.25 8.74562 1.25 10.4688V16.875C1.25 18.5981 2.65188 20 4.375 20H15.625C17.3481 20 18.75 18.5981 18.75 16.875C18.75 16.4435 18.4002 16.0938 17.9688 16.0938C17.5373 16.0938 17.1875 16.4435 17.1875 16.875C17.1875 17.7366 16.4866 18.4375 15.625 18.4375H4.375C3.51344 18.4375 2.8125 17.7366 2.8125 16.875V10.4688C2.8125 9.60719 3.51344 8.90625 4.375 8.90625H15.625C16.4866 8.90625 17.1875 9.60719 17.1875 10.4688V13.3594C17.1875 13.7909 17.5373 14.1406 17.9688 14.1406ZM13.1236 7.34375H6.87355V4.58852C6.87355 2.91996 8.27543 1.5625 9.99855 1.5625C11.7217 1.5625 13.1236 2.91996 13.1236 4.58852V7.34375Z"
                    fill="url(#paint0_linear)"
                  />
                  <path
                    d="M10 14.3359C10.4315 14.3359 10.7812 13.9862 10.7812 13.5547C10.7812 13.1232 10.4315 12.7734 10 12.7734C9.56853 12.7734 9.21875 13.1232 9.21875 13.5547C9.21875 13.9862 9.56853 14.3359 10 14.3359Z"
                    fill="url(#paint1_linear)"
                  />
                </g>
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#00B2FF" />
                    <stop offset="1" stopColor="#0085FF" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear"
                    x1="10"
                    y1="12.7734"
                    x2="10"
                    y2="14.3359"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#00B2FF" />
                    <stop offset="1" stopColor="#0085FF" />
                  </linearGradient>
                </defs>
              </svg>
              <p className="ml-2 mt-1 w-full text-base text-black">
                {position.value}
              </p>
              <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                <path
                  d="M13 1L7 7L1 1"
                  stroke="url(#paint0_linear)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1="1"
                    y1="4"
                    x2="13"
                    y2="4"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#00B2FF" />
                    <stop offset="1" stopColor="#0085FF" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="w-full h-[2px] bg-main mt-1 mb-3"></div>
            <Sheet
              visible={sheetVisible}
              onClose={() => setSheetVisible(false)}
              autoHeight
              mask
              handler
              swipeToClose
            >
              <div>
                <p className="font-bold text-base my-1 uppercase text-black text-center">
                  Chọn vai trò
                </p>
                {!!dataFamily &&
                  !!dataFamily.length &&
                  dataFamily.map((item) => {
                    return (
                      <div
                        className="w-full flex items-center justify-center py-1"
                        style={{
                          backgroundColor:
                            item === position ? "#e23795" : "transparent",
                        }}
                        key={item.id}
                        onClick={() => {
                          setPosition(item);
                          setSheetVisible(false);
                        }}
                      >
                        <p
                          className="font-bold text-base text-black text-center"
                          style={{
                            color: item === position ? "#FFFFFF" : "#000000",
                          }}
                        >
                          {item.value}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </Sheet>
            {/* done  */}
            <div
              onClick={onConfirm}
              className="flex items-center justify-center w-full bg-main rounded-2xl mx-auto py-2 my-4 mt-10"
            >
              <p className="text-base text-white text-center mr-1">Xong</p>
              <svg width="15" height="8" viewBox="0 0 15 8" fill="none">
                <path
                  d="M0 4H14M14 4L11.5 1M14 4L11.5 7"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {/* dele  */}
            {type === 1 && (
              <div
                onClick={onDelete}
                style={{
                  backgroundColor: "red",
                }}
                className="flex items-center justify-center w-full rounded-2xl mx-auto py-2 my-4 "
              >
                <p className="text-base text-[#fff] text-center mr-1">
                  Xoá thông tin
                </p>
                <svg width="15" height="8" viewBox="0 0 15 8" fill="none">
                  <path
                    d="M0 4H14M14 4L11.5 1M14 4L11.5 7"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
            <div className="h-1 bg-white"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBaby;

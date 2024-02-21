import React, { useContext } from "react";
import { Page, Sheet } from "zmp-ui";
import { closebtnIcon, gameIcon } from "../../utils/iconSvgNew";
import { useQuery } from "@tanstack/react-query";
import homeApi from "../../apis/home.apis";
import { AppContext } from "../../contexts/app.context";
import Images from "../../static";
import { checkBgIconObject } from "../../utils/checkBgIcon";
import { dataStatic } from "../../constants/data";
import {urldt} from "../../api";

const ModalToy = React.forwardRef((props, ref) => {
  const [showModalToy, setShowModalToy] = React.useState(false);
  const { selectedBaby } = useContext(AppContext);
  const { data: dataToyByMonth } = useQuery({
    queryKey: ["dataToyByMonth", selectedBaby?.id],
    queryFn: () => {
      // @ts-ignore
      return homeApi.getToyByMonth(selectedBaby?.realAge + 1);
    },
    enabled: Boolean(selectedBaby?.id),
  });
  React.useImperativeHandle(ref, () => {
    return {
      setShowModalToy,
    };
  });
  if (!showModalToy) return <></>;
  return (
    <div className="absolute w-full h-full top-0 bg-[#000000] bg-opacity-80 z-[9999]">
      <div className="h-full w-full bg-white mt-24 rounded-t-2xl">
        <div className="flex pl-4">
          <div className="flex items-center flex-1">
            {gameIcon}
            <p className="text-black text-base ml-2 mt-1">Đồ chơi theo tháng</p>
          </div>
          <div className="pr-4 pl-4" onClick={() => setShowModalToy(false)}>
            {closebtnIcon}
          </div>
        </div>
        <Page className="w-full h-full pb-40 no-scrollbar" hideScrollbar>
          {!!dataToyByMonth &&
            !!dataToyByMonth.data &&
            !!dataToyByMonth.data.data &&
            !!dataToyByMonth.data.data.toy &&
            !!dataToyByMonth.data.data.toy.length &&
            dataToyByMonth.data.data.toy.map((item, index) => {
              var url = item.image;
              var newUrl = url.replace(
                urldt,
                "linokids.net"
              );
              const cateofToy =
                dataStatic.listLesson[
                  dataStatic.listLesson.findIndex(
                    (x) => x.id === item.category_id
                  )
                ].name;
              return (
                <div
                  key={index}
                  className="flex rounded-2xl shadow-md my-4 mx-4 bg-white"
                >
                  <div className="w-[35%] h-24">
                    <img
                      src={item.image ? newUrl : Images.toy}
                      className="w-full h-full rounded-2xl"
                    />
                  </div>
                  <div className="flex-1 px-2 py-1">
                    <div className="flex items-center">
                      {checkBgIconObject(item.category_id).smallIcon}
                      <p className="text-[#DEDEDE] text-sm line-clamp-1 mx-3">
                        {cateofToy || "Đồ chơi"}
                      </p>
                    </div>
                    <p className="text-[#000000] text-sm mt-1 line-clamp-3">
                      {item.name || "Đồ chơi"}
                    </p>
                  </div>
                </div>
              );
            })}
        </Page>
      </div>
    </div>
  );
});
export default ModalToy;

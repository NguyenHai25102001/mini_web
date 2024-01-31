// import { useVirtualKeyboardVisible } from "hooks";
import React, {FC, useMemo, useState} from "react";
import {useLocation, useNavigate} from "react-router";
import {BottomNavigation} from "zmp-ui";
import Images from "../static";
import {LinkZaloOA} from "../api";

const tabs = {
    "/": {
        label: "Trang chủ",
        icon: Images.iconHome,
        activeIcon: Images.iconHomeActive,
    },
    "/shop": {
        label: "Shop Mẹ & Bé",
        icon: Images.iconShop,
        activeIcon: Images.iconShopActive,
    },
    "/advise": {
        label: "Tư vấn",
        icon: Images.iconCall,
        activeIcon: Images.iconCall,
    },
    "/milestone": {
        label: "Cột mốc",
        icon: Images.iconMilestone,
        activeIcon: Images.iconMilestoneActive,
    },

    "/profile": {
        label: "Thông tin bé",
        icon: Images.iconProfile,
        activeIcon: Images.iconProfileActive,
    },
};
export type TabKeys = keyof typeof tabs;


export const BOTTOM_NAVIGATION_PAGES = ["/", "/shop", "/milestone", "/profile"];

export const CustomNavigationBotom: FC = () => {
    const [toolbarClientHeight, setToolbarClientHeight] = useState<number|null>()
    const [activeTab, setActiveTab] = useState<TabKeys | string>("/");
    const navigate = useNavigate();
    const location = useLocation();
    const BottomNav = React.useMemo(() => {
        setActiveTab(location.pathname);
        return BOTTOM_NAVIGATION_PAGES.includes(location.pathname);
    }, [location]);

    if (BottomNav) {
        return (
            <div className={"fixed w-full flex"} style={{
                top: "100%",
                left: 0,
                zIndex: "100",
            }}>
                <div className="flex justify-center w-full">
                    <div className={"flex items-center bg-white pt-3 pb-1 absolute bottom-0 w-full max-w-[455px]  " }

                    >
                        {/*@ts-ignore*/}
                        {Object.keys(tabs).map((path: TabKeys, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center flex-1 justify-center"
                                onClick={() => {
                                    if (tabs[path].label === "Tư vấn") {
                                        return;
                                    } else {
                                        setActiveTab(path);
                                        navigate(path);
                                    }
                                }}
                            >
                                {tabs[path].label === "Tư vấn" ? (
                                    <div className="w-6 h-6"/>
                                ) : (
                                    <img
                                        src={
                                            path === activeTab ? tabs[path].activeIcon : tabs[path].icon
                                        }
                                        className="w-6 h-6 object-contain"
                                        alt={''}/>
                                )}
                                <span
                                    className="text-align text-[9px] font-bold"
                                    style={{
                                        color: path === activeTab ? "#01B2FF" : "#BFBFBF",
                                    }}
                                >
              {tabs[path].label}
            </span>
                            </div>
                        ))}
                        <div
                            className="absolute w-16 h-16 rounded-full overflow-hidden flex items-center -top-7 z-[10] left-1/2 -translate-x-1/2 self-center justify-center bg-white"
                            onClick={() => window.location.href=LinkZaloOA}
                        >
                            <div className=" w-14 h-14 rounded-full flex items-center justify-center bg-[#f5f7ff]">
                                <img src={Images.iconCall} className="w-6 h-6 object-contain " alt={''}/>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
    return <></>;
};

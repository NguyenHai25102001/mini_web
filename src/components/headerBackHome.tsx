import React from "react";
import { useNavigate } from "react-router-dom";
import Images from "../static";
import path from "../constants/path";
const HeaderBackHome = ({ title }: { title: string }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center pt-14 pb-4 bg-main">
      <div
        className="w-10 h-10 flex items-center justify-center bg-white rounded-[100%] ml-4"
        onClick={() => navigate(path.home)}
      >
        <svg width={19} height={20} viewBox="0 0 19 20" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.7674 13.2909C11.8738 13.2909 12.7744 14.1958 12.7744 15.3081V18.1688C12.7744 18.4078 12.9637 18.5994 13.2063 18.605H14.9579C16.3381 18.605 17.4602 17.4834 17.4602 16.1051V7.99165C17.4538 7.51734 17.2304 7.07093 16.8472 6.77426L10.7885 1.88423C9.97525 1.23229 8.83758 1.23229 8.02154 1.88609L2.00419 6.7724C1.60628 7.07837 1.38297 7.52478 1.37838 8.00746V16.1051C1.37838 17.4834 2.50043 18.605 3.88071 18.605H5.64879C5.89783 18.605 6.1 18.405 6.1 18.1595C6.1 18.1056 6.10643 18.0516 6.11746 18.0005V15.3081C6.11746 14.2023 7.01253 13.2983 8.11068 13.2909H10.7674ZM14.9579 20.0002H13.1898C12.1771 19.9761 11.396 19.1716 11.396 18.169V15.3083C11.396 14.9651 11.1139 14.6861 10.7675 14.6861H8.11534C7.77624 14.688 7.49596 14.9679 7.49596 15.3083V18.1597C7.49596 18.2295 7.48677 18.2964 7.46747 18.3597C7.36822 19.2804 6.59078 20.0002 5.64885 20.0002H3.88077C1.74051 20.0002 0 18.2527 0 16.1053V8.00116C0.0091896 7.07673 0.430073 6.23041 1.15697 5.67333L7.16238 0.795397C8.48476 -0.264822 10.3273 -0.264822 11.6469 0.793537L17.6955 5.67612C18.4059 6.2239 18.8267 7.06836 18.8387 7.98163V16.1053C18.8387 18.2527 17.0982 20.0002 14.9579 20.0002Z"
            fill="#e23795"
          />
        </svg>
      </div>
      <p className="text-lg  font-bold text-center text-white flex-1 mr-12">
        {title}
      </p>
    </div>
  );
};
export default HeaderBackHome;

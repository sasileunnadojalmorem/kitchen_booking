import { toast } from "react-toastify";
import axios from "axios";
import { getLocalStorage } from "@/utils/localStorage";
import { GetUserInformationResponse } from "@/types/user.dto";
import { ReissueTokenResponse } from "@/types/auth.dto";
import http from "./core";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/auth";

// 로그아웃 처리
export const patchLogOut = async () => {
  const refreshToken = getLocalStorage(REFRESH_TOKEN);
  const accessToken = getLocalStorage(ACCESS_TOKEN);
  try {
    await axios.post<void>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Refresh-Token": refreshToken,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    toast.error("로그아웃에 실패하였습니다. 다시 시도해 주십시오.");
  }
};

// 토큰 재발급 처리
export const postReissueToken = async (): Promise<{
  accessTokenResponse: string;
  refreshTokenResponse: string;
}> => {
  const refreshToken = getLocalStorage(REFRESH_TOKEN);

  const { headers } = await axios.post<ReissueTokenResponse>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/reissue`,
    {},
    {
      headers: {
        "Refresh-Token": refreshToken,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    }
  );

  return {
    accessTokenResponse: headers.authorization.split(" ")[1],
    refreshTokenResponse: headers["refresh-token"].split(" ")[1],
  };
};

// 회원 탈퇴 처리
export const deleteUserWithdraw = (userId: number) => {
  return http.delete<void>({
    url: `/api/v1/user/withdraw/${userId}`,
    headers: {
      Authorization: `Bearer ${getLocalStorage(ACCESS_TOKEN)}`,
      "Refresh-Token": getLocalStorage(REFRESH_TOKEN),
    },
  });
};


// 사용자 정보 조회
export const getUserInformation = () =>
  http.get<GetUserInformationResponse>({
    url: "/api/v1/user/info",
    headers: {
      Authorization: `Bearer ${getLocalStorage(ACCESS_TOKEN)}`,
    },
  });

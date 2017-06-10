/* eslint-disable quotes */
import { request, API, awaitHash } from '../utils/';

export function getHomepageInfo() {
  return request(API.homeInfo);
}
export function getTopWinners() {
  return request(API.findTopWinners);
}
export function getAllHistory() {
  return request(API.allHistory);
}
export function getMyDetails({ accessToken }) {
	return request(`${API.transactionDetails}?access_token=${accessToken}`);
}
export function getLoginHistory({ accessToken }) {
  return request(`${API.loginHistory}?pageSize=20&access_token=${accessToken}`);
}
export function getAllGamesSetting() {
  return request(API.gameSetting);
}
export function getCurrentResults(gameId) {
  return request(`${API.gamePlan}/${gameId}`);
}
export function checkUserId(username) {
	return request(`${API.userId}/${username}`);
}
export function getCurrentUser(accessToken) {
	return request(`${API.userInfo}?access_token=${accessToken}`);
}
export function getCardsAndWithdrawDetail({ accessToken }) {
  return request(`${API.userBanksAccount}?access_token=${accessToken}`);
}
export function getUserLogout(token) {
	return request(`${API.logout}?access_token=${token}`);
}
export function getBankCardDetails({ selectedBankCardId, accessToken }) {
	return request(`${API.userCards}/${selectedBankCardId}?access_token=${accessToken}`);
}
export function getPaymentList({ accessToken }) {
	return request(`${API.paymentList}?access_token=${accessToken}`);
}
export function getBankList({ accessToken }) {
	return request(`${API.bankList}/v2?access_token=${accessToken}`);
}
export function getOrderDetails({ accessToken }, { transactionTimeuuid }) {
	return request(
		`${API.orderDetail}?transactionTimeuuid=${transactionTimeuuid}&access_token=${accessToken}`
	);
}
export function getValidatePic({ varifyCode, webUniqueCode }) {
	return request(
		`${API.validatePic}?validateCode=${varifyCode.value}&webUniqueCode=${webUniqueCode}`
	);
}
export function getOrderHistory({ accessToken }, { state, pageSize }) {
	const url = [
		API.orderHistory,
		`?pageSize=${pageSize * 10}`,
		`&currentPage=1`,
		`&access_token=${accessToken}`
	];
	if (state !== 'ALL') {
		url.push(`&state=${state}`);
	}
	return request(_.join(url, ''));
}
export function getTransactionHistory({ accessToken }, {
	state, pageSize, currentPage, type, subType,
}) {
	const url = [
		API.transactionHistory,
		`?pageSize=${pageSize * 10}`,
		`&currentPage=${currentPage}`,
		`&access_token=${accessToken}`
	];
	if (type !== 'ALL') {
		url.push(`&type=${type}`);
	}
	if (subType !== 'ALL') {
		url.push(`&subType=${subType}`);
	}
	if (state !== 'ALL') {
		url.push(`&state=${state}`);
	}
	return request(_.join(url, ''));
}

export function putOrder({ order, accessToken }) {
  const body = JSON.stringify(order);
  // console.debug(body);
  return request(API.ordercap, {
    method: "post",
    headers: {
      'content-type': "application/json",
      Authorization: `bearer ${accessToken}`
    },
    body
  });
}
export function putUserLogin({ username, password }) {
	return awaitHash(username.value, password.value).then((hash) => {
		return request(API.login, {
			method: 'post',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({ hash, password: password.value, username: username.value })
		});
	});
}
export function putUserInfo({ accessToken }, {
	email, identityNumber, nickname, phoneNumber, qq
}) {
	return request(`${API.updateUserInfo}/?access_token=${accessToken}`, {
		method: 'put',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			email: email.value,
			identityNumber: `${identityNumber.value}`,
			nickname: nickname.value,
			phoneNumber: phoneNumber.value,
			qq: qq.value
		})
	});
}
export function putRegisterInfo({ accessToken }, {
	realName, securityPassword, bankAccountName,
	bankAddress, bankCardNo, bankCode, bankName,
	remarks,
}) {
	return request(`${API.updateBankInfo}/?access_token=${accessToken}`, {
		method: 'put',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			realName: realName.value,
			securityPassword: securityPassword.value,
			userBankCardDto: {
				bankAccountName: bankAccountName.value || realName.value,
				bankAddress: bankAddress.value,
				bankCardNo: bankCardNo.value,
				bankCode: bankCode.value,
				bankName: bankName.value,
				remarks: remarks.value
			}
		})
	});
}
export function putDefaultBankAccount({
	selectedBankCardId, accessToken
}) {
	return request(`${API.userCards}/${selectedBankCardId}?access_token=${accessToken}`, {
		method: 'put',
		headers: {
			'content-type': 'application/json'
		}
	});
}
export function putBankTransferConfirmation({ userModel, formModel, transferModel }) {
	const { realName, accessToken } = userModel;
	const { adminBankId } = transferModel;
	const { topupAmount, topupCardRealname, topupDate, topupTime, transferToupType } = formModel;
	const dateTime = `${topupDate.value} ${topupTime.value}:00`;
	return request(`${API.bankTransfers}/v3?access_token=${accessToken}`, {
		method: 'put',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			adminBankId,
			paymentPlatformOrderNo: '',
			topupAmount: topupAmount.value,
			topupCardRealname: topupCardRealname.value || realName,
			topupTime: dateTime,
			transferToupType: transferToupType.value
		})
	});
}
export function deleteBankAccount({
	selectedBankCardId, accessToken
}) {
	return request(`${API.userCards}/${selectedBankCardId}?access_token=${accessToken}`, {
		method: 'delete',
		headers: {
			'content-type': 'application/json'
		}
	});
}
export function postBankInfo({ accessToken }, {
  bankAccountName, bankAddress, bankCardNo,
	bankCode, bankName, remarks, realName
}) {
  return request(`${API.userCards}/?access_token=${accessToken}`, {
		method: 'post',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			bankAccountName: bankAccountName.value || realName.value,
			bankAddress: bankAddress.value,
			bankCardNo: bankCardNo.value,
			bankCode: bankCode.value,
			bankName: bankName.value,
			remarks: remarks.value
		})
	});
}
export function postTopupRequest({ userModel, formModel, transferModel }) {
	const { realName, accessToken } = userModel;
	const { bankCode, paymentId, paymentType } = transferModel;
	const { topupAmount } = formModel;
	const { value } = topupAmount;
	return request(`${API.topups}?access_token=${accessToken}`, {
		method: 'post',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			bankCode, depositor: realName, paymentId, paymentType, topupAmount: value
		})
	});
}
export function postPreRegisterGuest() {
	return request(API.preRegisterGuest, {
		method: 'post',
		headers: {
			'content-type': 'application/json'
		},
	});
}
export function postGuestRegistration({ username, password }) {
	return awaitHash(username.value, password.value).then((hash) => {
		console.debug(hash);
		return request(API.registerGuest, {
			method: 'post',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({ hash, password: password.value, username: username.value })
		});
	});
}
export function postRegistration({ username, password }) {
	return awaitHash(username.value, password.value).then((hash) => {
		console.debug(hash);
		return request(API.register, {
			method: 'post',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({ hash, password: password.value, username: username.value })
		});
	});
}
export function postNewPassword(userModel, formModel) {
	const { accessToken } = userModel;
	const { newPassword, securityMode } = formModel;
	const passwordTarget = _.camelCase(securityMode);
	const password = formModel[passwordTarget].value;
	return request(`${API.changePwd}/?access_token=${accessToken}`, {
		method: 'post',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			mode: securityMode, newPassword: newPassword.value, password
		})
	});
}
export function postBankTransferRequest({ accessToken }, { adminBankId }) {
	return request(`${API.bankTransfers}/v2?access_token=${accessToken}`, {
		method: 'post',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({ adminBankId })
	});
}
export function postWithdrawalRequest({ userModel, transferModel, formModel }) {
	const { accessToken } = userModel;
	const { userBankId } = transferModel;
	const { withdrawalAmount, charge, securityPassword } = formModel;
	return request(`${API.userWithDraw}?access_token=${accessToken}`, {
		method: 'post',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			amount: withdrawalAmount.value,
			charge: charge.value,
			userBankId,
			withDrawCode: securityPassword.value
		})
	});
}

import express from 'express';
import { routes } from "./constant.js";
import { createUser } from "./controller/createOrEditCont.js";
import { signinUser } from "./controller/signinCont.js";
import { EditUser } from './controller/createOrEditCont.js';
import { expenseList } from "./controller/expenseListCont.js";
import { expenseAdd } from "./controller/expenseAddCont.js";
import { expenseUpdate } from './controller/expenseUpdateCont.js';
import { downloadImage } from "./controller/downloadImageCont.js"
import { logout } from "./controller/logoutCont.js";
import { AddUserAccounts } from './controller/userAccountsCont.js';
import { DeleteUserAccount } from './controller/userAccountsCont.js';
import { FetchAccount } from './controller/FetchAccountCont.js';
import { insights } from './controller/insightsCont.js';

const router = express.Router();

router.post(routes.CreateUser, createUser);

router.post(routes.SigninUser, signinUser);

router.post(routes.EditUser, EditUser);

router.post(routes.Insights, insights);

router.post(routes.UserAccount, AddUserAccounts);

router.post(routes.DeleteUserAccount, DeleteUserAccount);

router.post(routes.FetchAccount, FetchAccount);

router.post(routes.ExpenseList, expenseList);

router.post(routes.Expensesadd, expenseAdd);

router.post(routes.ExpenseUpdate, expenseUpdate);

router.post(routes.DownloadImage, downloadImage);

router.get(routes.Logout, logout);

export default router;

import React from 'react';
import css from '../../styles/homepage/tutorialList.less';
import { Row } from '../General';

export default function TutorialList() {
  return (
    <Row className={css.tutorial}>
      <h3 className={css.tutorial_header}>新手指导</h3>
      <ul className={css.tutorial_list}>
        <li className={css.tutorial_listItem}>
          <a className={css.permalink} href="">如何注册成为106彩票彩票会员？</a>
          </li>
        <li className={css.tutorial_listItem}>
          <a className={css.tutorial_listPermalink} href="">忘记登录密码了怎么办？</a>
        </li>
        <li className={css.tutorial_listItem}>
          <a className={css.tutorial_listPermalink} href="">在106彩票充值要手续费吗？</a>
        </li>
      </ul>
    </Row>
  );
}

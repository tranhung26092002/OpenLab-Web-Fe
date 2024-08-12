import React, { Fragment } from 'react';
import styles from './Footer.module.scss';

type Props = {};

const Footer = (props: Props) => {
    return (
        <Fragment>
            <section className={styles.footer}>
                <div className={styles.info_footer}>
                    <div className={styles.footer_introduce}>
                        <div className={styles.footer_links}>
                            <a href="/">Công ty Cổ phần Công nghệ OpenLAB</a>
                        </div>
                        <p className={styles.mt}>
                            Đơn vị chuyên cung cấp các dịch vụ AI/IoT giá rẻ cho chuyển đổi số giáo dục
                        </p>
                    </div>
                    <div className={styles.container_footer}>
                        <div className={styles.footer_location}>
                            <div className={styles.footer_widget}>
                                <h5 className={styles.widget_title}>Địa chỉ</h5>
                                <ul className={styles.list_unstyled}>
                                    <li>
                                        <i className="fa fa-phone-alt me-2"></i>
                                        <a href="tel:+84865746698">(+84) 865 746 698</a>
                                    </li>
                                    <li>
                                        <i className="fa fa-envelope me-2"></i>
                                        <a href="mailto:openlab@gmail.com">openlab@gmail.com</a>
                                    </li>
                                    <li>
                                        <i className="fa fa-map-marker-alt me-2"></i>
                                        <a
                                            href="https://www.google.com/maps/place/68+Ng%C3%B5+6+Ao+Sen,+P.+M%E1%BB%99+Lao,+H%C3%A0+%C4%90%C3%B4ng,+H%C3%A0+N%E1%BB%99i,+Vi%E1%BB%87t+Nam/@20.9820423,105.7848074,17z/data=!3m1!4b1!4m5!3m4!1s0x3135accc2899c203:0x1ddb7fee1ea1e809!8m2!3d20.9820423!4d105.7873823?entry=ttu"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            68A/6 Ao Sen, Hà Đông, HN
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className={styles.footer_discover}>
                            <div className={styles.footer_widget}>
                                <h5 className={styles.widget_title}>Khám phá</h5>
                                <ul className={styles.list_unstyled}>
                                    <li><a href="/About">Giới thiệu</a></li>
                                    <li><a href="/Blog">Blog</a></li>
                                    <li><a href="/Contact">Liên hệ</a></li>
                                    <li><a href="">Hỗ trợ</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className={styles.footer_project}>
                            <div className={styles.footer_widget}>
                                <h5 className={styles.widget_title}>Sản phẩm</h5>
                                <ul className={styles.list_unstyled}>
                                    <li><a href="#">E-LAB</a></li>
                                    <li><a href="#">E-KIT</a></li>
                                    <li><a href="#">Trợ giảng số E-CHAT</a></li>
                                    <li><a href="#">Tất cả sản phẩm</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.btm_footer}>
                    <div className={styles.content}>
                        <p className={styles.text_center}>
                            © 2024 Bản quyền thuộc về
                            <a href="/"> OpenLAB</a>
                        </p>
                    </div>
                </div>
                <div className={styles.fixed_btm_top}>
                    <a href="#top-header" className={styles.scroll_to_top}>
                        <i className="fa fa-angle-up"></i>
                    </a>
                </div>
            </section>
        </Fragment>
    );
};

export default Footer;

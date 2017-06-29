import React from 'react';
import { connect } from 'dva';
import css from '../../styles/homepage/carousel.less';

function CarouselBag({
	promotionBanners
}) {
	function renderScene() {
		if (promotionBanners) {
			return promotionBanners.map((banner, index) => {
				const { bannerImageUrl, userClickUrl } = banner;
				const carouselImgStyles = {
					backgroundImage: `url('${bannerImageUrl}')`
				};
				return (
					<div className={css.carousel_img_wrapper} key={index}>
						<a
							target="_black"
							style={carouselImgStyles}
							href={userClickUrl}
							className={css.carousel_img}
						/>
					</div>
				);
			});
		}
		return <div />;
	}
	return (
		<div className={css.container}>
			{ renderScene() }
		</div>
	);
}

const mapStatesToProps = ({ gameInfosModel }) => {
	const { promotionBanners } = gameInfosModel;
	return { promotionBanners };
};

export default connect(mapStatesToProps)(CarouselBag);

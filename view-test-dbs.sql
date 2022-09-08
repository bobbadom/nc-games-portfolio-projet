\c nc_games_test

SELECT reviews.review_id, reviews.owner, reviews.category, reviews.review_img_url, reviews.title, comments.votes, comments.created_at, comments.votes FROM reviews
LEFT JOIN comments ON reviews.review_id = comments.review_id;




--getBooks
SELECT * FROM public.book ORDER BY isbn ASC

SELECT author,genre FROM public.book_records WHERE isbn = $1

--addCart
INSERT into public.cart VALUES ($1,$2,$3)

--removeFromCart
DELETE from public.cart WHERE uid=$1 AND isbn=$2

--getBookInfo
SELECT * FROM public.book WHERE isbn = $1

--getCart
SELECT * FROM public.cart WHERE uid = $1
SELECT name, stockquantity, price FROM public.book WHERE isbn = $1
SELECT uid,userBilling,userShipping FROM public.users WHERE uid = $1

--createOrder
SELECT COUNT(*) FROM public.orders
INSERT into public.Orders VALUES ($1,$2,$3,$4,$5)
SELECT * FROM public.cart WHERE uid = $1
INSERT into public.order_contents VALUES ($1,$2,$3)
UPDATE public.book SET stockquantity= stockquantity - 1 WHERE isbn=$1
SELECT stockquantity,isbn,pid,lastmonthsales FROM public.book WHERE isbn=$1
SELECT * FROM public.publisher WHERE pid=$1
DELETE from public.cart WHERE uid=$1 AND isbn=$2

--getUsers
SELECT * FROM public.users ORDER BY uid ASC
INSERT into public.users VALUES ($1,$2,$3,$4,$5,$6)

--searchQuery -- SPENCER LOOK IDK HOW IT WORKS
SELECT * FROM public.users ORDER BY UID ASC
SELECT * FROM public.users

--report1
SELECT isbn, count(*) FROM public.order_contents WHERE isbn IS NOT NULL GROUP BY isbn
SELECT * FROM public.book where isbn=$1

--report2
SELECT book_records.author,  COUNT(book_records.isbn) FROM book_records LEFT JOIN order_contents ON book_records.isbn = order_contents.isbn GROUP BY book_records.author

--report3
SELECT book_records.genre,  COUNT(book_records.isbn) FROM book_records LEFT JOIN order_contents ON book_records.isbn = order_contents.isbn GROUP BY book_records.genre

--controlPanel
SELECT * FROM public.publisher
SELECT * FROM public.book ORDER BY isbn ASC
INSERT into public.book VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
SELECT * FROM public.has_numbers WHERE pid = $1
INSERT into public.book_records VALUES ($1,$2,$3,$4,$5)

--removeBook
DELETE FROM book WHERE isbn =$1
# Restaurant management website
This project was an assignment for course "Internet Applications Programming" in spring semester of school year 2023/2024. It represents a website made using MEAN stack (with Mongo non-relational database) for managing restaurants, including handling reservations and food deliveries made by guests. All data about users (both registered and non-registered), restaurants, reservations and food deliveries is stored in database.

There are three types of users: restaurant guests (*guests*), restaurant waiters (*waiters*) and website administrators (*administrators*). Each of them has different privileges and can view and use different pages on website. There are also pages that are accessible to non-registered visitors.

## About website database
The Mongo database consists of different types of documents:
1. Guest document (represents registered guest)
2. Request document (represents registration request)
3. Waiter document (represents waiter added by administrator)
4. Administrator document (represents administrator)
5. Restaurant document (represents restaurant added by administrator)
6. Reservation document (represents reservation request / approved reservation)
7. Review document (represents rating guest holder of reservation gave to restaurant after visit)
8. Dish document (represents one dish from the restaurant menu)
9. Cart element document (represents amount of some restaurant dish guest added to their delivery cart)
10. Delivery document (represents food delivery request / approved food delivery made by guest)

## Website features by types of account
### Non-registered visitors
On "*Pocetna strana*" (Home) page visitors can view basic statistics such as number of registered guests, number of restaurants or number of reservations in recent period of time (in last 24 hours,in last week or in last month). They can also search restaurants by restaurant's name, type and/or address. Search results can be viewed in ascending or descending order by name, type or addres.

On "*Prijava korisnika*" (Login) page registered guests and waiters can log in to their account in order to receive exclusive privilege. To log in, they need to enter their credentials (username and password), where message is shown if there is no registered user with that credentials, otherwise they are logged in and sent to specific main page for corresponding type of user. The administrators cannot log in using this page, instead they must use URL `localhost:4200/home/tajna` to navigate to the secret web page where they can log in.

On "*Registracija*" (Sign up) page non-registered visitors can send requests to be registered as guests. In registration form they enter all neccessary information such as user credentials and additional data neccessary for a guest. Some fields may require specific format of text (entered text is tested using regular expressions). Waiters cannot register in this way, instead they are simply added by an administrator.

On "*Promena lozinke*" (Change password) page any registered user can change their password. If user lost their password, they can first request to answer security question and later change their password.

### Guests
On "*Profil*" (Profile) page guests can view and modify their account information (which includes adding profile picture or changing / deleting existing one).

On "*Restorani*" (Restaurants) page guests can search restaurants similar to non-registered visitors, while they can also see restaurant ratings and open specific restaurant's web page.

On specific restaurant's web page guests can view information about restaurant, restaurant location on map and all guest reviews. It is possible to make a reservation request based on date and time of visit (guests can also pick the table they want, or let waiter pick one table for them). There is also the restaurant's menu with dishes' names, pictures, used ingredients and price per unit (kg/L). Guests can add some amount any dish to their shopping cart, which can be edited in separate web page and confirmed as food delivery request.

On "*Rezervacije*" (Reservations) page guests can view all of their approved reservations. Guests can cancel their reservations up until 45 minutes before visit. For every confirmed visit, the guest can leave one review with comment and number rate from 1 to 5. The failed reservations (rejected requests, canceled or missed reservations) are also shown.

On "*Dostava hrane*" (Food delivery) page guests can view all of their approved food delivery requests. For the food deliveries that are still not delivered guests can see estimated remaining time for food to arrive.

There is also "*Izloguj se*" (Log out) button. If the guest clicks this button, they will be logged out of website and navigated to the home page for non-registered visitors.

### Waiters
On "*Profil*" (Profile) page waiters can view and modify their account information (which includes adding profile picture or changing / deleting existing one).

On "*Rezervacije*" (Reservations) page waiters can view pending reservation requests and approved reservations. The waiter can approve reservation in which case the selected table becomes occupied during the visit period (if there is no selected table, waiter must select one free table), and people that will visit restaurant based on that reservation become the waiter's responsibility (they become *waiter's visitors*). If the reservation is not canceled on time, waiter can confirm visit or mark reservation as missed. Each time guest misses their reservation, they receive a penalty. After 3 penalties, guest account becomes blocked (they cannot make new reservation requests) until the administrator unblocks them.

On "*Dostave*" (Deliveries) page waiters can view all pending food delivery requests which they can approve or reject. If the request is approved, the waiter must select approximate time it takes for food delivery to be delivered to guest.

On "*Statistika*" (Statistics) page waiters can view statistics regarding approved reservations shown using different types of data charts. The bar chart shows total number of waiter's visitors for each day of the week. The pie chart shows total number of visitors for each waiter that work in same restaurant as logged waiter. The histogram chart shows percentage of approved reservations for the restaurant for each day of the week in last 24 months.

There is also "*Izloguj se*" (Log out) button. If the waiter clicks this button, they will be logged out of website and navigated to the home page for non-registered visitors.

### Administrators
On "*Pregled podataka*" ("Data overview") page administrators can view and modify data regarding all registered guests and waiters (including activating/deactivating accounts and unblocking guests) as well as view all restaurants.

On "*Zahtevi za registraciju*" (Registration requests) page administrators can approve or reject registration requests. If the request is approved, a new registered guest is created and saved in database with data identical to data from request.

On "*Dodaj konobara* (Add a waiter) page administrators can add a new waiter in database. If entered data satisfies required criteria, the waiter is created and saved in database.

On "*Dodaj restoran* (Add a restaurant) page administrators can add a new restaurant in database. In order to add restaurant successfully, restaurant layout must be defined (either by uploading .JSON file or drawing inside defined rectangle). If entered data satisfies required criteria, the restaurant is created and saved in database.

There is also "*Izloguj se*" (Log out) button. If the administrator clicks this button, they will be logged out of website and navigated to the home page for non-registered visitors.

## Packages used in project
In order to use packages for the project, project user must follow the guide provided in file ["package installation guide.txt"](https://github.com/nikcin18/Restaurant-management-website/blob/main/package%20installation%20guide.txt)

## Important notes
- This project contains only source code files important for the assignment. In order to use this project, you must first download and unzip [*backend*](https://drive.google.com/file/d/1eGPbkOjGIWZEz3ZvIuXISyCbjOAH7SKG/view?usp=sharing) and [*frontend*](https://drive.google.com/file/d/1vvfSSMuyNJiPHuNYxP_ErpxzyW2ytoM7/view?usp=sharing) folders with empty *src* subfolders, then replace empty *src* subfolder with corresponding *src* subfolder with files in each folder.
- Each user's username and e-mail address must be unique in database. User cannot be registered/added or have their e-mail address changed if another user has the same username or e-mail address. If registration request is approved or rejected, the username and e-mail address provided in request are considered as taken permanently (even if user changes e-mail address), and all other pending requests that collide with that request are marked as duplicates, so they cannot be approved.
- Restaurant's opening time is set during adding new restaurant by administrator. After that, it is not visible by any user.
- Guest reservation requests are made with either no selected table or with one selected table. In latter case if the table is not available for specified date and time, waiter can only reject request, without offering reservation with another selected table.

## Project versions
### 1.0 Initial version
This is the original project that was submitted as solution for the course assignment. The variable names, function names, as well as database data, are written in Serbian.
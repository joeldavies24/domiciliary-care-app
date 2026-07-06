module.exports = function (app) {
    const passport = require("passport");
    const User = require("./models/user");
    const Visit = require("./models/visit");
    const Request = require("./models/request");
    const Task = require("./models/task");
    const Routine = require("./models/routine");
    const CarePlan = require("./models/careplan");

    passport.use(User.createStrategy());
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    checkAuth = (req, res, next) => {
        if (req.isAuthenticated()) {
        return next();
        }
        res.redirect("/home/login");
    };

    const checkAdmin = (req, res, next) => {
        if (req.isAuthenticated() && req.user.userType === 'admin') return next();
        res.status(403).send("Unauthorized: Admins Only");
    };

    app.get("/", (req, res) => res.render("home"));
    app.get("/home/login", (req, res) => res.render("home/login"));
    app.post("/home/login", passport.authenticate("local", {
        successRedirect: "/user/index",
        failureRedirect: "/home/login",
    }));

    app.get("/logout", (req, res, next) => {
        req.logout((err) => {
            if (err) return next(err);
            res.redirect("/home/login");
        });
    });

    app.get("/user/index", checkAuth, (req, res) => {
        res.render("user/index", { user: req.user });
    });

    app.get("/user/profile", checkAuth, async (req, res) => {
        try {
            let carePlan = null;

            if (req.user.userType === 'client') {
                carePlan = await CarePlan.findOne({ clientId: req.user._id });
            }

            res.render("user/profile", { 
                user: req.user,
                carePlan
            });

        } catch (err) {
            console.error(err);
            res.status(500).send("Error loading profile");
        }
    });

    app.get("/user/profile/edit", checkAuth, (req, res) => {
        let formattedDate = "";
        if (req.user.userDOB) {
            const dateObj = new Date(req.user.userDOB);
            if (!isNaN(dateObj)) formattedDate = dateObj.toISOString().split('T')[0];
        }
        res.render("edit", { user: req.user, dob: formattedDate });
    });

    app.post("/user/profile/edit", checkAuth, async (req, res) => {
        try {
            await User.findByIdAndUpdate(req.user._id, {
                userForename: req.body.userForename,
                userSurname: req.body.userSurname,
                username: req.body.username,
                userDOB: req.body.userDOB,
                userAddress: {
                    street: req.body.street,
                    town: req.body.town,
                    county: req.body.county,
                    postcode: req.body.postcode,
                    country: req.body.country,
                },
            });
            res.redirect("/user/profile");
        } catch (err) {
            res.status(500).send("Error updating profile.");
        }
    });

    // Heidorn, K. (2019). Making a Calendar in Vanilla Javascript. [online] DEV Community. Available at: https://dev.to/knheidorn/making-a-calendar-in-vanilla-javascript-48j8
    app.get("/user/timetable", checkAuth, async (req, res) => {
        try {
            const weekOffset = parseInt(req.query.weekOffset) || 0;
            const today = new Date();
            
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1) + (weekOffset * 7));
            startOfWeek.setHours(0, 0, 0, 0);

            const weekDates = [];
            for (let i = 0; i < 7; i++) {
                const d = new Date(startOfWeek);
                d.setDate(startOfWeek.getDate() + i);
                weekDates.push(d);
            }

            let query = {};
            if (req.user.userType === 'admin') {
                query = {}; 
            } else if (req.user.userType === 'carer') {
                query = { carerId: req.user._id }; 
            } else if (req.user.userType === 'client') {
                query = { clientId: req.user._id };
            }

            const visits = await Visit.find(query).populate('clientId').lean();

            res.render("user/timetable", {
                user: req.user,
                visits,
                weekDates,
                weekOffset
            });
        } catch (err) {
            console.error(err);
            res.status(500).send("Error loading timetable");
        }
    });

    app.get("/user/visitation/:id", checkAuth, async (req, res) => {
        try {
            const visit = await Visit.findById(req.params.id)
                .populate({
                    path: "clientId",
                    model: "User"
                })
                .populate({
                    path: "carerId",
                    model: "User"
                })
                .populate("tasks.task")
                .lean();

            console.log("CLIENT:", visit.clientId);
            console.log("CARERS:", visit.carerId);

            if (!visit) {
                return res.status(404).send("Visit not found");
            }

            res.render("visitation", {
                visit,
                user: req.user
            });
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });

    app.post("/user/visitation/:id/clockin", checkAuth, async (req, res) => {
        try {
            const { lat, lng } = req.body;
            await Visit.findByIdAndUpdate(req.params.id, {
                checkIn: new Date(),
                checkInLocation: { latitude: lat, longitude: lng }
            });
            res.redirect(`/user/visitation/${req.params.id}`);
        } catch (err) {
            res.status(500).send("Error clocking in");
        }
    });

    app.post("/user/visitation/:id/clockout", checkAuth, async (req, res) => {
        try {
            const visit = await Visit.findById(req.params.id);
            if (!visit) return res.status(404).send("Visit not found");

            const submittedTasks = req.body.tasks || {};

            const updatedTasks = visit.tasks.map((item, index) => {
                const submitted = submittedTasks[index];

                return {
                    task: item.task,
                    completed: submitted && submitted.completed === 'true'
                };
            });

            await Visit.findByIdAndUpdate(req.params.id, {
                checkOut: new Date(),
                clientFeeling: req.body.clientFeeling,
                visitNotes: req.body.notes,
                tasks: updatedTasks
            });

            res.redirect("/user/timetable");

        } catch (err) {
            console.error(err);
            res.status(500).send("Error finishing visit");
        }
    });

    app.get("/admin/index", checkAdmin, (req, res) => {
        res.render("admin/index", { user: req.user });
    });

    app.get("/admin/create/user", checkAdmin, (req, res) => {
        res.render("admin/create/user", { errorMessage: null, user: req.user });
    });

    app.post("/admin/create/user", checkAdmin, async (req, res) => {
        try {
            const { username, password, userForename, userSurname, userType, nhsNumber, adminSecret, userAddress } = req.body;
            if (userType === 'admin' && adminSecret !== "admin") {
                return res.status(400).render("admin/create/user", {
                    errorMessage: "Invalid admin code",
                    user: req.user
                });
            }

            let isAdminAccount = (userType === 'admin');

            const userData = { username, userForename, userSurname, userType, adminAC: isAdminAccount };

            if (userType === 'client') {
                userData.nhsNumber = nhsNumber;
                userData.userAddress = {
                    street: userAddress.street,
                    town: userAddress.town,
                    postcode: userAddress.postcode,
                    coordinates: {
                        latitude: userAddress.coordinates?.latitude || "0",
                        longitude: userAddress.coordinates?.longitude || "0"
                    }
                };
            }

            const newUser = new User(userData);
            await User.register(newUser, password);
            res.redirect(userType === 'client' ? "/admin/clients" : "/admin/staff");
        } catch (err) {
            res.status(400).render("admin/create/user", { errorMessage: err.message, user: req.user });
        }
    });

    app.get("/admin/staff", checkAdmin, async (req, res) => {
        const users = await User.find({ userType: { $ne: 'client' } });
        res.render('admin/staff', { users, user: req.user });
    });

    app.get("/admin/clients", checkAdmin, async (req, res) => {
        const users = await User.find({ userType: 'client' });
        res.render('admin/clients', { users, user: req.user });
    });

    app.get('/admin/visits', checkAdmin, async (req, res) => {
        try {
            const visits = await Visit.find()
                .populate('clientId') 
                .populate('carerId')
                .sort({ date: -1 });

            res.render('admin/visits', { 
                visits: visits, 
                user: req.user 
            });
        } catch (err) {
            console.error("Error fetching visits:", err);
            res.status(500).send("Internal Server Error");
        }
    });

    app.get('/admin/visit/:id', checkAdmin, async (req, res) => {
        try {
            const visit = await Visit.findById(req.params.id)
                .populate('clientId')
                .populate('carerId')
                .populate('tasks.task');
            if (!visit) {
                return res.status(404).send("Visit not found");
            }
            res.render('admin/visitdetail', {
                visit,
                user: req.user
            });
        } catch (err) {
            console.error("Visit Detail Error:", err);
            res.status(500).send("Internal Server Error");
        }
    });

    app.get("/admin/create/visit", checkAdmin, async (req, res) => {
        try {
            const carers = await User.find({ userType: 'carer' }).sort({ userSurname: 1 });
            const clients = await User.find({ userType: 'client' }).sort({ userSurname: 1 });
            const tasks = await Task.find({}).sort({ taskName: 1 });
            const routines = await Routine.find({}).sort({ routineName: 1 });

            res.render("admin/create/visit", { 
                carers, 
                clients, 
                tasks, 
                routines, 
                user: req.user 
            });
        } catch (err) {
            res.status(500).send("Error loading schedule page");
        }
    });

    app.post("/admin/create/visit", checkAdmin, async (req, res) => {
        try {
            const { clientId, date, scheduledStart, scheduledEnd, selectedTasks, coordinates } = req.body;

            const rawCarerId = req.body.carerId || req.body['carerId[]'];
            const carerArray = Array.isArray(rawCarerId)
                ? rawCarerId
                : (rawCarerId ? [rawCarerId] : []);

            const clientExists = await User.findById(clientId);
            if (!clientExists) {
                return res.status(400).send("Invalid client selected");
            }

            const validCarers = await User.find({
                _id: { $in: carerArray },
                userType: 'carer'
            });

            if (validCarers.length !== carerArray.length) {
                return res.status(400).send("One or more carers are invalid");
            }

            let taskList = [];
            if (selectedTasks) {
                const taskIds = Array.isArray(selectedTasks) ? selectedTasks : [selectedTasks];
                taskList = taskIds.map(id => ({
                    task: id,
                    completed: false
                }));
            }

            const newVisit = new Visit({
                carerId: carerArray,
                clientId,
                date,
                scheduledStart,
                scheduledEnd,
                tasks: taskList,
                coordinates: {
                    latitude: Number(coordinates?.latitude) || 0,
                    longitude: Number(coordinates?.longitude) || 0
                }
            });

            await newVisit.save();
            res.redirect("/admin/index");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error creating visit");
        }
    });

    app.get("/admin/tasks", checkAdmin, async (req, res) => {
        const tasks = await Task.find({}).sort({ category: 1 });
        res.render("admin/tasks", { tasks, user: req.user });
    });

    app.get("/admin/routines", checkAdmin, async (req, res) => {
        const routines = await Routine.find({}).populate('clientId');
        res.render("admin/routines", { routines, user: req.user });
    });

    app.post("/admin/create/task", checkAdmin, async (req, res) => {
        const { taskName, category, dosage, description } = req.body;
        const newTask = new Task({ taskName, category, dosage: category === 'Medication' ? dosage : "", description });
        await newTask.save();
        res.redirect("/admin/tasks");
    });

    app.get("/user/request", checkAuth, (req, res) => res.render("request", { user: req.user }));

    app.post("/user/request", checkAuth, async (req, res) => {
        try {
            const { requestType, otherDetails, details } = req.body;

            const newRequest = new Request({
                requesterId: req.user._id,
                requestType: requestType,
                otherDetails: requestType === 'Other' ? otherDetails : null,
                details: details,
                status: 'Pending'
            });

            await newRequest.save();
            res.redirect("/user/index?success=true");
        } catch (err) {
            console.error("Request Error:", err);
            res.status(500).send("Error submitting request: " + err.message);
        }
    });

    app.get("/admin/requests", checkAdmin, async (req, res) => {
        const filterStatus = req.query.show === 'resolved' ? 'Resolved' : 'Pending';
        const requests = await Request.find({ status: filterStatus }).populate('requesterId');
        res.render("admin/requests", { requests, currentFilter: filterStatus, user: req.user });
    });

    app.get('/admin/requests/:id', checkAdmin, async (req, res) => {
        try {
            const request = await Request.findById(req.params.id)
                .populate('requesterId', 'username userForename userSurname email');
            if (!request) {
                return res.status(404).send("Request not found");
            }
            res.render('admin/requestdetail', { 
                user: req.user, 
                request: request 
            });
        } catch (err) {
            console.error(err);
            res.status(500).send("Error loading request details");
        }
    });

    app.post("/admin/requests/:id/resolve", checkAdmin, async (req, res) => {
        await Request.findByIdAndUpdate(req.params.id, { status: 'Resolved' });
        res.redirect("/admin/requests");
    });

    app.post('/admin/requests/:id/delete', checkAdmin, async (req, res) => {
        try {
            const requestId = req.params.id;
            const request = await Request.findById(requestId);
            if (!request) {
                return res.status(404).send("Request not found");
            }

            if (request.status !== 'Resolved') {
                return res.status(400).send("Only resolved requests can be deleted.");
            }
            await Request.findByIdAndDelete(requestId);
        
            res.redirect('/admin/requests?show=resolved');
        } catch (err) {
            console.error("Delete Error:", err);
            res.status(500).send("Error deleting request");
        }
    });

    app.post("/admin/create/careplan", checkAdmin, async (req, res) => {
        try {
            const { 
                clientId, allergies, dietaryRequirements, 
                mobilityRestrictions, adminNotes,
                contactName, contactRelation, contactMobile,
                condition, historyNotes
            } = req.body;

            const emergencyContacts = [];
            if (contactName) {
                for (let i = 0; i < contactName.length; i++) {
                    if (contactName[i]) {
                        emergencyContacts.push({
                            name: contactName[i],
                            relation: contactRelation[i],
                            mobile: contactMobile[i]
                        });
                    }
                }
            }

            const medicalHistory = [];
            if (condition) {
                for (let i = 0; i < condition.length; i++) {
                    if (condition[i]) {
                        medicalHistory.push({
                            condition: condition[i],
                            notes: historyNotes[i]
                        });
                    }
                }
            }

            const newCarePlan = new CarePlan({
                clientId,
                allergies: allergies ? allergies.split(',').map(s => s.trim()) : [],
                dietaryRequirements: dietaryRequirements ? dietaryRequirements.split(',').map(s => s.trim()) : [],
                mobilityRestrictions,
                emergencyContacts,
                medicalHistory,
                adminNotes
            });

            await newCarePlan.save();
            res.redirect("/admin/clients");

        } catch (err) {
            console.error(err);
            res.status(500).send("Error creating care plan");
        }
    });

    app.get("/user/details/:id", checkAuth, async (req, res) => {
        try {
            const profileUser = await User.findById(req.params.id);
            const carePlan = await CarePlan.findOne({ clientId: req.params.id });

            res.render("user/userdetail", {
                user: req.user,
                profileUser: profileUser, 
                carePlan: carePlan
            });
        } catch (err) {
            res.status(500).send("Error");
        }
    });

    app.get("/admin/create/routine", checkAdmin, async (req, res) => {
        try {
            const clients = await User.find({ userType: 'client' }); 
            const tasks = await Task.find({});
            
            res.render("admin/create/routine", { 
                clients: clients, 
                tasks: tasks,
                user: req.user 
            });
        } catch (err) {
            console.error(err);
            res.redirect("/admin/index");
        }
    });

    app.get("/admin/create", checkAdmin, (req, res) => {
        res.render("admin/create", { user: req.user });
    });

    app.post("/admin/create/routine", checkAdmin, async (req, res) => {
        try {
            const { routineName, description, clientId, tasks } = req.body;
            const newRoutine = new Routine({
                routineName,
                description,
                clientId,
                tasks: Array.isArray(tasks) ? tasks : (tasks ? [tasks] : [])
            });

            await newRoutine.save();
            res.redirect("/admin/create"); 
        } catch (err) {
            console.error("Error creating routine:", err);
            res.status(500).send("Server Error");
        }
    });

    app.get('/admin/create/careplan/:clientId', checkAdmin, async (req, res) => {
        try {
            const client = await User.findById(req.params.clientId);
            if (!client) {
                return res.status(404).send("Client not found");
            }
            res.render('admin/create/careplan', {
                user: req.user,
                client,
                clientId: client._id
            });
        } catch (err) {
            console.error(err);
            res.status(500).send("Server Error");
        }
    });

    app.get('/admin/create/task', checkAdmin, async (req, res) => {
        try {
            const clients = await User.find({ role: 'client' });
            res.render('admin/create/task', { 
                user: req.user, 
                clients: clients 
            });
        } catch (err) {
            res.status(500).send("Server Error");
        }
    });

    app.post('/admin/create/task', checkAdmin, async (req, res) => {
        try {
            const { clientId, taskDescription, category, frequency } = req.body;
            
            const newTask = new Task({
                clientId,
                description: taskDescription,
                category,
                frequency,
                status: 'pending'
            });
            await newTask.save();
            res.redirect('/admin/index');
        } catch (err) {
            res.status(500).send("Error creating task");
        }
    });

    app.get("/admin/edit_user/:id", checkAdmin, async (req, res) => {
        try {
            const editUser = await User.findById(req.params.id);
            if (!editUser) {
                return res.redirect("/admin/index");
            }
            res.render("admin/edit_user", {
                user: req.user,
                editUser,
                error: null
            });
        } catch (err) {
            console.log(err);
            res.redirect("/admin/index");
        }
    });

    app.post("/admin/edit_user/:id", checkAdmin, async (req, res) => {
        try {
            const editUser = await User.findById(req.params.id);
            if (!editUser) {
                return res.redirect("/admin/index");
            }
                if (editUser.userType === "admin") {
                    if (req.body.adminPassword !== "admin") {
                        return res.render("admin/edit_user", {
                            user: req.user,
                            editUser,
                            error: "Invalid admin code"
                        });
                    }
                }

            editUser.userForename = req.body.userForename;
            editUser.userSurname = req.body.userSurname;
            editUser.phoneNumber = req.body.phoneNumber;
            editUser.userStatus = req.body.userStatus === "true";
            editUser.adminAC = req.body.adminAC === "true";

            await editUser.save();

            if (editUser.userType === "client") {
                return res.redirect("/admin/clients");
            } else {
                return res.redirect("/admin/staff");
            }

        } catch (err) {
            console.log(err);
            res.redirect("/admin/index");
        }
    });

    app.get('/admin/edit_task/:id', checkAdmin, async (req, res) => {
        const task = await Task.findById(req.params.id);
        res.render('admin/edit_task', {
            user: req.user,
            task
        });
    });

    app.post('/admin/edit_task/:id', checkAdmin, async (req, res) => {
        const { taskName, category, dosage, description } = req.body;
        await Task.findByIdAndUpdate(req.params.id, {
            taskName,
            category,
            dosage,
            description
        });
        res.redirect('/admin/tasks');
    });

    app.get('/admin/edit_visit/:id', checkAdmin, async (req, res) => {
        try {
            const visit = await Visit.findById(req.params.id)
                .populate('carerId')
                .populate('clientId');
            
            const carers = await User.find({ userType: 'carer' }).sort({ userSurname: 1 });
            const clients = await User.find({ userType: 'client' }).sort({ userSurname: 1 });
            const tasks = await Task.find().sort({ taskName: 1 });

            res.render('admin/edit_visit', { visit, carers, clients, tasks, user: req.user });
        } catch (err) {
            res.status(500).send("Error loading visit");
        }
    });

    app.post('/admin/edit_visit/:id', checkAdmin, async (req, res) => {
        try {
            const { clientId, carerId, selectedTasks, date, scheduledStart, scheduledEnd } = req.body;

            const taskObjects = (Array.isArray(selectedTasks) ? selectedTasks : [selectedTasks])
                .filter(id => id)
                .map(id => ({ task: id }));

            await Visit.findByIdAndUpdate(req.params.id, {
                clientId,
                carerId: carerId ? (Array.isArray(carerId) ? carerId : [carerId]) : [],
                tasks: taskObjects,
                date,
                scheduledStart,
                scheduledEnd
            });

            res.redirect('/admin/visits');

        } catch (err) {
            console.error(err);
            res.status(500).send("Error updating visit");
        }
    });

    app.get('/user/careplan/details/:id', checkAuth, async (req, res) => {
        try {
            const carePlan = await CarePlan.findById(req.params.id)
                .populate('clientId');

            if (!carePlan) {
                return res.status(404).send('Care plan not found');
            }

            if (
                req.user.userType !== 'admin' &&
                req.user._id.toString() !== carePlan.clientId._id.toString() &&
                req.user.userType !== 'carer'
            ) {
                return res.status(403).send("Unauthorized");
            }

            res.render('user/careplandetail', {
                user: req.user,
                carePlan
            });

        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    app.post('/admin/delete_visit/:id', checkAdmin, async (req, res) => {
        try {
            await Visit.findByIdAndDelete(req.params.id);
            res.redirect('/admin/visits');
        } catch (err) {
            console.error(err);
            res.status(500).send("Error deleting visit");
        }
    });

    app.post('/admin/delete_task/:id', checkAdmin, async (req, res) => {
        try {
            await Task.findByIdAndDelete(req.params.id);
            res.redirect('/admin/tasks');
        } catch (err) {
            console.error(err);
            res.status(500).send("Error deleting task");
        }
    });

    app.post('/admin/delete_routine/:id', checkAdmin, async (req, res) => {
        try {
            await Routine.findByIdAndDelete(req.params.id);
            res.redirect('/admin/routines');
        } catch (err) {
            console.error(err);
            res.status(500).send("Error deleting routine");
        }
    });

    app.post('/admin/delete_user/:id', checkAdmin, async (req, res) => {
        try {
            const userToDelete = await User.findById(req.params.id);
            if (!userToDelete) {
                return res.status(404).send("User not found");
            }

            if (req.user._id.toString() === req.params.id) {
                return res.status(400).send("You cannot delete your own account");
            }

            if (userToDelete.userType === "admin") {
                const adminCode = req.body.adminCode;
                if (adminCode !== "admin") {
                    return res.status(403).send("Invalid admin code");
                }
            }

            await User.findByIdAndDelete(req.params.id);

            return res.redirect(
                userToDelete.userType === "client"
                    ? '/admin/clients'
                    : '/admin/staff'
            );

        } catch (err) {
            console.error(err);
            res.status(500).send("Error deleting user");
        }
    });

    app.get('/careplan/edit/:id', checkAdmin, async (req, res) => {
        try {
            const carePlan = await CarePlan.findById(req.params.id)
                .populate('clientId');
            if (!carePlan) {
                return res.status(404).send("Care plan not found");
            }
            res.render('admin/edit_careplan', {
                user: req.user,
                carePlan
            });
        } catch (err) {
            console.error(err);
            res.status(500).send("Server Error");
        }
    });

    app.post('/careplan/edit/:id', async (req, res) => {
        try {
            const contacts = [];
            if(req.body.contactName){
                for(let i = 0; i < req.body.contactName.length; i++){
                    if(req.body.contactName[i]){
                        contacts.push({
                            name: req.body.contactName[i],
                            relation: req.body.contactRelation[i],
                            mobile: req.body.contactMobile[i]
                        });
                    }
                }
            }
            const medicalHistory = [];

            if(req.body.condition){
                for(let i = 0; i < req.body.condition.length; i++){
                    if(req.body.condition[i]){
                        medicalHistory.push({
                            condition: req.body.condition[i],
                            notes: req.body.historyNotes[i]
                        });
                    }
                }
            }
            await CarePlan.findByIdAndUpdate(req.params.id, {
                allergies:
                    req.body.allergies
                        ? req.body.allergies
                            .split(',')
                            .map(a => a.trim())
                        : [],
                dietaryRequirements:
                    req.body.dietaryRequirements
                        ? req.body.dietaryRequirements
                            .split(',')
                            .map(d => d.trim())
                        : [],
                mobilityRestrictions:
                    req.body.mobilityRestrictions,
                adminNotes:
                    req.body.adminNotes,
                emergencyContacts:
                    contacts,
                medicalHistory:
                    medicalHistory,
                lastReviewDate:
                    new Date()
            });
            res.redirect(`/user/careplan/details/${req.params.id}`);
        } catch(err){
            console.log(err);
            res.redirect('back');
        }
    });

    app.get("/home/about", (req, res) => res.render("home/about", { user: req.user }));

    app.get("/home/contact", (req, res) => res.render("home/contact", { user: req.user }));

    app.post("/home/contact", async (req, res) => {
        const { name, email, message } = req.body;
        const newRequest = new Request({
            requesterId: req.user ? req.user._id : null,
            guestName: req.user ? null : name,
            guestEmail: req.user ? null : email,
            requestType: 'Inquiry',
            details: message
        });
        await newRequest.save();
        res.redirect("/");
    });

    app.get('/admin/routine/:id', checkAdmin, async (req, res) => {
        try {
            const routine = await Routine.findById(req.params.id)
                .populate('clientId')
                .populate('tasks');

            if (!routine) {
                return res.status(404).send("Routine not found");
            }

            res.render('admin/routinedetail', {
                routine,
                user: req.user
            });
        } catch (err) {
            console.error(err);
            res.status(500).send("Error loading routine");
        }
    });

    app.get('/admin/edit_routine/:id', checkAdmin, async (req, res) => {
        try {
            const routine = await Routine.findById(req.params.id)
                .populate('clientId');

            const clients = await User.find({ userType: 'client' }).sort({ userSurname: 1 });
            const tasks = await Task.find({}).sort({ taskName: 1 });

            if (!routine) {
                return res.redirect('/admin/routines');
            }

            res.render('admin/edit_routine', {
                routine,
                clients,
                tasks,
                user: req.user
            });

        } catch (err) {
            console.error(err);
            res.status(500).send("Error loading edit page");
        }
    });

    app.post('/admin/edit_routine/:id', checkAdmin, async (req, res) => {
        try {
            const { routineName, description, clientId, tasks } = req.body;

            await Routine.findByIdAndUpdate(req.params.id, {
                routineName,
                description,
                clientId,
                tasks: Array.isArray(tasks) ? tasks : (tasks ? [tasks] : [])
            });

            res.redirect('/admin/routines');

        } catch (err) {
            console.error(err);
            res.status(500).send("Error updating routine");
        }
    });
};
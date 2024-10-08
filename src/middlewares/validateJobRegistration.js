function validateJobRegistration(req,res,next){
    try{
        const{title,description,category,designation,location,company,salary,exprienceReq,opeanings,skillsRequired,lastDateApply} = req.body;


        if(!title || title.length < 5){
            throw new Error(`Invalid title`);
        }

        if(!description || description < 15 || description > 200){
            throw new Error(`Invalid description`);
        }

        // if(!["tech", "non-tech"].includes(value)){
        //     throw new Error("Invalid category type")
        // }
        if(!category || category < 5  || category > 100){
            throw new Error(`In valid category`);
        }

        if(!designation || designation < 1 || designation > 25){
            throw new Error(`Invalid designation`);
        }

        if(!location || location.length < 1 || location.length > 25){
                throw new Error(`Invalid location`);
            }

        if(!company || company < 1 || company > 100){
            throw new Error(`Invalid Company`);
        }

        if(!salary || salary <= 0){
            throw new Error(`Invalid salary`);
        }
        if(!exprienceReq || exprienceReq < 0){
            throw new Error(`Invalid exprience`);
        }
        if(!opeanings || opeanings <= 0){
            throw new Error(`Invalid opeaning`);
        }
        if(!skillsRequired || skillsRequired < 3 || skillsRequired > 100){
            throw new Error(`Invalid skills`);
        }
        if(!lastDateApply || lastDateApply < Date.now()){
            throw new Error(`Invalid date`);
        }

        next();
    }catch(err){
        console.log(err);
        res.status(402).send(err.message);
    }

}

module.exports = validateJobRegistration;
const express = require("express")
const path = require("path")
const app = express();
const _ = require("lodash")
const cors = require("cors")
const valid = require("validator")
const mysql = require("mysql")

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "hCX(T]IvI3X#cHO^li=",
    database: "astraliva"

});






app.use(express.json())
app.use(cors())


app.post("/subscribe",(req,res)=>{
    var EMAscii = ""
    const out = req.body;
    console.log(out.email);
    if(valid.isEmail(out.email)){
        var EM = out.email;
        for (let index = 0; index < EM.length; index++) {
            const element = EM[index];
            EMAscii = EMAscii + (element.charCodeAt(0)).toString(16);

        }
        var Token = EMAscii;
        console.log(Token);
        
    }
    
})

app.post("/reg", (req, res) => {
    var EMAscii = ""
    var encript = ""
    const out = req.body;
    var EM = out.EM;
    console.log(EM);
    if (valid.isEmail(EM)) {
        for (let index = 0; index < EM.length; index++) {
            const element = EM[index];
            EMAscii = EMAscii + (element.charCodeAt(0)).toString(16);

        }
        for (let index = 0; index < (out.PN).length; index++) {
            var element = (out.PN)[index];
            console.log(element)
            encript = encript + ((element).charCodeAt(0));
            console.log(encript)
        }

    }
    var Token = EMAscii + "_" + encript
    console.log(Token);
    console.log(req.body)


    // connection.connect((err) => {
        // if (err) {
        //     console.log("error found");

        //     throw err;
        // }
        console.log("Data base Connected");

        // var search_CM = ""
        var split_Token = Token.split("_")
        var search_CM = "SELECT Token FROM `register`"
        var emailcount = 0
        connection.query(search_CM, (err, data) => {

            if (err) {
                throw err;
            }
            for (let index = 0; index < data.length; index++) {
                var element = data[index].Token;
                element = element.split("_")
                console.log(element);
                console.log(split_Token);


                if (element[0] === split_Token[0]) {
                    emailcount = emailcount + 1
                    console.log("Email Entered");

                }
                if (element[1] === split_Token[1]) {
                    emailcount = emailcount + 1
                    console.log("Phone Entered");

                }
            }
            console.log(emailcount);

            if (emailcount !== 0) {
                res.send("Email or Phone already used")

            } else if (emailcount === 0) {
                var upload_query = "INSERT INTO `register` (`FIrst Name`, `Last Name`, `Email`, `Phone Number`, `Pincode`, `Address`, `CountryCode`, `Token`) VALUES ('" + out.FN + "', '" + out.LN + "', '" + out.EM + "', '" + out.PN + "', '" + out.PC + "', '" + out.AD + "', '" + out.CCM + "', '" + Token + "')"
                console.log(upload_query);
                connection.query(upload_query, (err, data) => {
                    if (err) {
                        throw err;
                    }
                    res.send("The process completed")
                })
            }
            // connection.end()

        })
        
       


    })



    app.get("/admin", (req, res) => {
        connection.connect((err) => {
            if (err) {
                throw err;
            }
            console.log("/ url is running");
            var search_CM = "SELECT * FROM `register`;"
            connection.query(search_CM, (err, data) => {
                if (err) {
                    throw err;
                }
                // console.log(data)
                res.send(data.map((Index,datas)=>{
                    return Index;
                }))
            })
        })
        
    })

app.use(express.static(path.join(__dirname,'build')))

app.get("*", function(request, response) {
    // console.log(path.join(__dirname,"build","index.html"));
    response.sendFile(path.join(__dirname,"build","index.html"));
    
});












const PORT = process.env.PORT || 3124

app.listen(PORT, () => {
    console.log('Server running on ' + PORT)
    console.log("http://localhost:" + PORT + "/");

})




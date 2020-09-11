<template>
    <div class="box">
        <div id="login">
            <div id="bgd">
                <canvas id='myCanvas' :width='width' :height='height'>
                </canvas>
            </div>
            <div class="title">
                <h1>高级评教</h1>
            </div>
            <div class="tell">
                <div>简介</div>
            </div>
            <div id="loginBox">
                <h4>登录</h4>
                <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="0px">
                    <el-form-item label="" prop="phone" style="margin-top:40px;">
                        <el-row>
                            <el-col :span='2'>
                                <i class="el-icon-user"></i>
                            </el-col>
                            <el-col :span='22'>
                                <el-input class="inps" placeholder='用户名，手机号,' v-model="loginForm.phone"></el-input>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="" prop="yzm">
                        <el-row>
                            <el-col :span='2'>
                                <i class="el-icon-lock"></i>
                            </el-col>
                            <el-col :span='22' class="yzm">
                                <el-input class="inps" placeholder='验证码' v-model="loginForm.yzm"></el-input>
                            </el-col>
                                <el-button :class="[yzmBtnK]" @click="getyzm" type="primary" :disabled="isDisable">获取验证码<span v-show="isshow" >({{djs}})</span></el-button>
                        </el-row>
                    </el-form-item>
                    <el-form-item style="margin-top:55px;" class="submit">
                        <el-button type="primary" round class="submitBtn" @click="submitForm">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>


<script>
    import {login} from "network/crud/login";
    import {sendSms} from "network/crud/sendSms";

    export default {
        name: "Login",
        data() {
            return {
                //是否显示倒计时
                isshow:false,
                //是否发送成功
                isPhone: false,
                yzmBtnK:"yzmBtn",
                //是否可点击
                isDisable:false,
                djs: 60,

                canvas: null,
                context: null,
                stars: [], //星星数组
                shadowColorList: [
                    "#39f",
                    "#ec5707",
                    "#b031d4",
                    "#22e6c7",
                    "#92d819",
                    "#14d7f1",
                    "#e23c66"
                ], //阴影颜色列表
                directionList: ["leftTop", "leftBottom", "rightTop", "rightBottom"], //星星运行方向
                speed: 20, //星星运行速度
                last_star_created_time: new Date(), //上次重绘星星时间
                Ball: class Ball {
                    constructor(radius) {
                        this.x = 0;
                        this.y = 0;
                        this.radius = radius;
                        this.color = "";
                        this.shadowColor = "";
                        this.direction = "";
                    }

                    draw(context) {
                        context.save();
                        context.translate(this.x, this.y);
                        context.lineWidth = this.lineWidth;
                        var my_gradient = context.createLinearGradient(0, 0, 0, 8);
                        my_gradient.addColorStop(0, this.color);
                        my_gradient.addColorStop(1, this.shadowColor);
                        context.fillStyle = my_gradient;
                        context.beginPath();
                        context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
                        context.closePath();

                        context.shadowColor = this.shadowColor;
                        context.shadowOffsetX = 0;
                        context.shadowOffsetY = 0;
                        context.shadowBlur = 10;

                        context.fill();
                        context.restore();
                    }
                }, //工厂模式定义Ball类
                width: window.innerWidth,
                height: window.innerHeight,
                loginForm: {
                    phone: "",
                    yzm: ""
                },
                loginRules: {
                    phone: [
                        { required: true, message: "请输入手机号", trigger: "blur" }
                    ],
                    yzm: [{ required: true, message: "请输入验证码", trigger: "blur" }]
                }
            };
        },
        methods: {
            //获取验证码
            getyzm(){
                sendSms(this.loginForm.phone).then(res=> {
                    this.result = res.data;
                    //判断数据
                    if (this.result == "0") {
                        console.log("wu用户")
                    } else if(this.result == "2"){
                        console.log("短信发送成功")
                        this.isPhone = true;
                        this.isshow = true;
                        this.isDisable=true;
                        this.yzmBtnK = "yzmBtn_no";
                        //倒计时djsf
                        this.djsF = setInterval(()=>{
                            this.djs --;
                            if(this.djs === 0){
                                clearInterval(this.djsF);
                                this.isshow=false;
                                this.yzmBtnK = "yzmBtn";
                                this.isDisable=false;
                            }
                        },1000)
                    } else {
                        console.log("短信发送失败")
                    }
                })
            },

            //提交登录
            submitForm() {
                login(this.loginForm.phone,this.loginForm.yzm).then(res=> {
                    this.result = res.data;
                    //判断数据
                    if(this.isPhone){
                        if (this.result == "0") {
                            console.log("无用户用户");
                        } else if(this.result == "1"){
                            console.log("验证码错误");
                        }else {
                            this.$store.commit('SET_token',this.result);
                            console.log("成功");
                            this.$router.push('/index');
                        }
                    }
                })
            },

            //重复动画
            drawFrame() {
                let animation = requestAnimationFrame(this.drawFrame);
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.createStar(false);
                this.stars.forEach(this.moveStar);
            },
            //展示所有的星星
            createStar(params) {
                let now = new Date();
                if (params) {
                    //初始化星星
                    for (var i = 0; i < 50; i++) {
                        const radius = Math.random() * 3 + 2;
                        let star = new this.Ball(radius);
                        star.x = Math.random() * this.canvas.width + 1;
                        star.y = Math.random() * this.canvas.height + 1;
                        star.color = "#ffffff";
                        star.shadowColor = this.shadowColorList[
                            Math.floor(Math.random() * this.shadowColorList.length)
                            ];
                        star.direction = this.directionList[
                            Math.floor(Math.random() * this.directionList.length)
                            ];
                        this.stars.push(star);
                    }
                } else if (!params && now - this.last_star_created_time > 3000) {
                    //每隔3秒重绘修改颜色其中30个球阴影颜色
                    for (var i = 0; i < 30; i++) {
                        this.stars[i].shadowColor = this.shadowColorList[
                            Math.floor(Math.random() * this.shadowColorList.length)
                            ];
                    }
                    this.last_star_created_time = now;
                }
            },
            //移动
            moveStar(star, index) {
                if (star.y - this.canvas.height > 0) {
                    //触底
                    if (Math.floor(Math.random() * 2) === 1) {
                        star.direction = "leftTop";
                    } else {
                        star.direction = "rightTop";
                    }
                } else if (star.y < 2) {
                    //触顶
                    if (Math.floor(Math.random() * 2) === 1) {
                        star.direction = "rightBottom";
                    } else {
                        star.direction = "leftBottom";
                    }
                } else if (star.x < 2) {
                    //左边
                    if (Math.floor(Math.random() * 2) === 1) {
                        star.direction = "rightTop";
                    } else {
                        star.direction = "rightBottom";
                    }
                } else if (star.x - this.canvas.width > 0) {
                    //右边
                    if (Math.floor(Math.random() * 2) === 1) {
                        star.direction = "leftBottom";
                    } else {
                        star.direction = "leftTop";
                    }
                }
                if (star.direction === "leftTop") {
                    star.y -= star.radius / this.speed;
                    star.x -= star.radius / this.speed;
                } else if (star.direction === "rightBottom") {
                    star.y += star.radius / this.speed;
                    star.x += star.radius / this.speed;
                } else if (star.direction === "leftBottom") {
                    star.y += star.radius / this.speed;
                    star.x -= star.radius / this.speed;
                } else if (star.direction === "rightTop") {
                    star.y -= star.radius / this.speed;
                    star.x += star.radius / this.speed;
                }
                star.draw(this.context);
            }
        },
        mounted() {
            this.canvas = document.getElementById("myCanvas");
            this.context = this.canvas.getContext("2d");

            this.createStar(true);
            this.drawFrame();
        }
    };
</script>

<style scoped>
/* position: fixed;脱离文本流 */
    .box{height: 100vh;position: fixed; top: 0; left: 0;z-index: 1;}
    #login {
        width: 100vw;
        height: 100vh;
        font-size: 16px;
        background-repeat: no-repeat;
        background-position: left top;
        background-color: #242645;
        color: #fff;
        font-family: "Source Sans Pro";
        background-size: 100%;
        background-image: url("../../assets/login/login_bg.png");
        position: relative;
    }
    #bgd {
        height: 100%;
        width: 100%;
        overflow: hidden;;
    }
    .yzm{
        width: 55%;
    }
    .yzmBtn{
        background-color: transparent;
        border: #3399ff 2px solid;
        width: 100px;
        margin-left: 3%;
        font-size: 10px;
    }
    .yzmBtn_no{
        background-color: #A1A3A7;
        border: rgba(5, 5, 7, 0.09) 2px solid;
        width: 100px;
        margin-left: 3%;
        font-size: 10px;
    }
    .title{
        font-size: 30px;
        width:200px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 3% auto;
    }
    .tell{
        position: absolute;
        width: 20%; height: 280px;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto 10%;
        padding: 4% 2% 2% 2%;
        box-shadow: -15px 15px 15px rgba(6, 17, 47, 0.7);
        opacity: 1;
        background: linear-gradient(
                230deg,
                rgba(53, 57, 74, 0) 0%,
                rgb(0, 0, 0) 100%
        );
    }
    #loginBox {
        width: 20%;
        height: 280px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto 60%;
        padding: 3% 2% 2% 2%;
        box-shadow: -15px 15px 15px rgba(6, 17, 47, 0.7);
        opacity: 1;
        background: linear-gradient(
                230deg,
                rgba(53, 57, 74, 0) 0%,
                rgb(0, 0, 0) 100%
        );
    }
    #loginBox>h4{
        font-size: 20px;
        width: 20%;
        margin-left: auto;margin-right: auto;
    }

    .inps input {
        border: none;
        color: #fff;
        background-color: transparent;
        font-size: 12px;
    }
    .submit{
        width: 70%;
        margin-left: auto;margin-right: auto;
    }
    .submitBtn {
        background-color: transparent;
        color: #39f;
        width: 100%;
        margin-left: auto;margin-right: auto;
    }
</style>
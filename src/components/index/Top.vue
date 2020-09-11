<template>
    <div class="top">
        <div><slot name="left"></slot></div>
        <div>
            <el-form :model="SearchForm" :rules="Rules" ref="SearchForm" label-width="0px">
                <el-form-item label="" prop="search" style="margin-top: 5px;">
                    <el-input placeholder='Search' v-model="SearchForm.search"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div><a @click="signOut">Sign out</a></div>
    </div>
</template>

<script>
    export default {
        name: "Top",
        data(){
            return{
                SearchForm: {
                    search: "",
                },
                Rules: {
                    search: [
                        { message: "Search", trigger: "blur" }
                    ]
                }
            }
        },
        methods:{
            signOut(){

            },
        }
    }
</script>

<style scoped>
    .top{
        position: fixed;
        top: 0;
        left: 0;
        height: 48px;
        line-height: 48px;
        width: 100%;
        display: flex;
        font-size: 15px;
    }
    .top>div{height: 100%;}
    .top>div:nth-child(1){
        flex: 1.5;
        background: rgb(0, 0, 0);
        text-align: center;
        color: white;
    }
    .top>div:nth-child(2){
        flex: 8;
        background: rgba(73, 78, 83, 0.64);
    }
   .top>div:nth-child(3){
        flex: 0.5;
        background: rgb(52, 58, 64);
        text-align: center;
       font-size: 12px;
       color: rgba(160, 160, 160, 0.98);
       cursor: pointer;
    }

</style>
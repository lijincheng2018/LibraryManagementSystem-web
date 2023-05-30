<template>
  <div><el-input v-model="webstring"></el-input>
  <el-button type="success" @click="filterXSS(webstring)"></el-button></div>
  
</template>

<script>
export default {
  data() {
    return {
      checkAll: false,
      form: {
        peoples: []
      },
      webstring:'',
      people_list: [{id: 1, name: 'John'}, {id: 2, name: 'Mary'}, {id: 3, name: 'Bob'}],
    }
  },
  methods: {
    test(){
      this.filterXSS(this.webstring)
      
    },
    filterXSS(oriStr){
        if(!oriStr){
        return oriStr;
        }
        var charCodes=['3c','3e','27','22','28','29','60',{format:'script{}',chr:'3a'}];//要转义字符的16进制ASCII码[1<  2>  3'  4"  5(  6)  7`]
        var xssChars=[],filterChars=[],tmpFormat='{}',tmpChr;
        for(var i=0;i<charCodes.length;i++){
        if('string'==typeof charCodes[i]){
        tmpFormat='{}';
        tmpChr=charCodes[i];
        }else{
        tmpFormat=charCodes[i].format;
        tmpChr=charCodes[i].chr
        }
        xssChars.push(tmpFormat.replace('{}','\\u00'+tmpChr));
        xssChars.push(tmpFormat.replace('{}','%'+tmpChr));//1次encode
        xssChars.push(tmpFormat.replace('{}','%25'+tmpChr));//2次encode
        filterChars.push(tmpFormat.replace('{}','&#x'+tmpChr+';'));
        filterChars.push(tmpFormat.replace('{}','%26%23x'+tmpChr+'%3B'));//1次encode
        filterChars.push(tmpFormat.replace('{}','%2526%2523x' + tmpChr + '%253B'));//2次encode
        }
        for(var i=0;i<xssChars.length;i++){
        oriStr=oriStr.replace(new RegExp(xssChars[i],'gi'),filterChars[i]);
        }
        //预防script:
        oriStr=oriStr.replace(/script[\u000d\u000a\u0020]+\:/,'script:');
        //return oriStr;
        console.log(oriStr)
    }
  },
  created() {
    console.log(filterXSS(sss))
  }
}
</script>

<style>

</style>

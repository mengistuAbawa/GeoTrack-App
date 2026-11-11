import React,{ReactNode} from 'react';import{ScrollView,StyleSheet,ViewStyle}from'react-native';import{SafeAreaView}from'react-native-safe-area-context';
export default function Screen({children,contentStyle}:{children:ReactNode;contentStyle?:ViewStyle}){return <SafeAreaView style={s.safe}><ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={[s.content,contentStyle]}>{children}</ScrollView></SafeAreaView>}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:'#F4F7FC'},content:{padding:20,paddingBottom:36}});

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  FlatList
} from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { AntDesign } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import ConnectionRequest from '../../../components/ConnectionRequests'
import UserProfile from '../../../components/UserProfile'

export default function Home () {
  const [userId, setUserId] = useState('')
  const [user, setUser] = useState()
  const [users, setUsers] = useState([])
  const router = useRouter()
  const [connectionRequests, setConnectionRequests] = useState([])

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('authToken')
      if (token) {
        console.log({ token })
        setUserId(token)
      }
    }

    fetchUser()
  }, [])

  const fetchUserProfile = async () => {
    console.log({ new: true })
    try {
      const response = await axios.get(
        `http://192.168.148.29:4444/profile/${userId}`
      )
      const userData = response.data.user
      console.log({ userData })
      setUser(userData)
    } catch (error) {
      console.log('error fetching user profile', error)
    }
  }

  useEffect(() => {
    if (userId) {
      console.log('Fetching')
      fetchUserProfile()
    }
  }, [userId])

  useEffect(() => {
    if (userId) {
      fetchUsers()
    }
  }, [userId])
  const fetchUsers = async () => {
    axios
      .get(`http://192.168.148.29:4444/users/${userId}`)
      .then(response => {
        setUsers(response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }
  console.log({ users })

  useEffect(() => {
    if (userId) {
      fetchFriendRequests()
    }
  }, [userId])
  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(
        `http://192.168.148.29:4444/connection-request/${userId}`
      )
      if (response.status === 200) {
        const connectionRequestsData = response.data?.map(friendRequest => ({
          _id: friendRequest._id,
          name: friendRequest.name,
          email: friendRequest.email,
          image: friendRequest.profileImage
        }))

        setConnectionRequests(connectionRequestsData)
      }
    } catch (error) {
      console.log('error', error)
    }
  }
  //   console.log(connectionRequests);
  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
        <Pressable
          onPress={() => router.push('/network/connections')}
          style={{
            marginTop: 10,
            marginHorizontal: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600' }}>
            Manage My Network
          </Text>
          <AntDesign name='arrowright' size={22} color='black' />
        </Pressable>

        <View
          style={{ borderColor: '#E0E0E0', borderWidth: 2, marginVertical: 10 }}
        />

        <View
          style={{
            marginTop: 10,
            marginHorizontal: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600' }}>
            Invitations (0)
          </Text>
          <AntDesign name='arrowright' size={22} color='black' />
        </View>

        <View
          style={{ borderColor: '#E0E0E0', borderWidth: 2, marginVertical: 10 }}
        />

        <View>
          {connectionRequests?.map((item, index) => (
            <ConnectionRequest
              item={item}
              key={index}
              connectionRequests={connectionRequests}
              setConnectionRequests={setConnectionRequests}
              userId={userId}
            />
          ))}
        </View>

        <View style={{ marginHorizontal: 15 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Text>Grow your network faster</Text>
            <Entypo name='cross' size={24} color='black' />
          </View>

          <Text>
            Find and contact the right people. Plus see who's viewed your
            profile
          </Text>
          <View
            style={{
              backgroundColor: '#FFC72C',
              width: 140,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 25,
              marginTop: 8
            }}
          >
            <Text
              style={{ textAlign: 'center', color: 'white', fontWeight: '600' }}
            >
              Try Premium
            </Text>
          </View>
        </View>
        <FlatList
          data={users}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          numColumns={2}
          keyExtractor={item => item._id}
          renderItem={({ item, key }) => (
            <UserProfile userId={userId} item={item} key={key} />
          )}
        />
      </ScrollView>
    </>
  )
}

import { Button, Container, Stack, TextField } from '@mui/material'
import React from 'react'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import axiosInstance from '../utils/axios'
import Router from 'next/router'
import { autheAtom } from '../recoil/autheAtom'
import { useRecoilState } from 'recoil'
import decode from 'jwt-decode'

export default function Home() {
	const [autheState, setAutheState] = useRecoilState(autheAtom)

	const UserSchema = Yup.object().shape({
		email: Yup.string().required('Email is required'),
		password: Yup.string().required('Password is required'),
	})

	const defaultValues = {
		email: 'admin@gmail.com',
		password: 'admin',
	}

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: yupResolver(UserSchema), defaultValues })

	const onSubmit = async (data) => {
		try {
			const res = await axiosInstance.post('/auth/login', data, {
				withCredentials: true,
			})
			const user = res?.data?.data
			const accessToken = res?.data?.accessToken
			setAutheState((prev) => ({
				...prev,
				accessToken,
				user,
				isAuthenticated: true,
			}))
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<Container maxWidth='xs' sx={{ mt: 20 }}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Stack spacing={3}>
					<TextField label='Email' fullWidth {...register('email')} />
					<TextField label='Password' fullWidth {...register('password')} />
					<Button variant='contained' type='submit' size='large'>
						Login
					</Button>
				</Stack>
			</form>
		</Container>
	)
}


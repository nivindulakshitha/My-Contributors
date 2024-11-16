import React from 'react'
import "@/styles/userCard.css";
import Image from 'next/image';

const UserCard = ({ username }: { username: string }) => {
	return (
		<div className="card">
			<div className="card-image">
				<Image width={64} height={64} src={`https://avatars.githubusercontent.com/u/88942532?v=4`} alt="" />
			</div>
			<div className="card-content">
				<h2 className='link'>{username}</h2>
			</div>
		</div>
	)
}

export default UserCard
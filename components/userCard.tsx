import React from 'react'
import "@/styles/userCard.css";
import Image from 'next/image';

const UserCard = ({ username, details }: { username: string, details: any }) => {
	console.log(details);

	return (
		<div className="card">
			<div className="card-image">
				<Image width={64} height={64} src={details.avatar_url} alt="" />
			</div>
			<div className="card-content">
				<h2 className='link'>{details.name ? details.name : details.login}</h2>
				<h6>@{username} ● {details.followers} followers ● joined {new Date(details.created_at).toLocaleDateString('en-US', {
					month: 'long',
					day: 'numeric',
					year: 'numeric'
				})}</h6>
				<p>{details.bio ? details.bio : null} </p>
			</div>
		</div>
	)
}

export default UserCard
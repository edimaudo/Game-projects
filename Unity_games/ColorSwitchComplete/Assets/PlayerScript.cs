using UnityEngine;
using System.Collections;

public class PlayerScript : MonoBehaviour {

	public float intensity = 1;
	public float MaxVelocity = 10;
	public float MaxDownwardForce = -15;
	public Rigidbody2D body;

	void Start(){
		body = GetComponent<Rigidbody2D> ();
		SetupInitalColor ();
	}

	void FixedUpdate(){
		if (Input.GetMouseButtonDown (0)) {

			ManagerReferences refs = GameObject.Find ("Manager").GetComponent<ManagerReferences> ();
			if (refs.gameIsON && body.gravityScale == 0) {
				refs.UnfreezePlayerSphere ();
			}

			if (body != null) {
				body.AddForce (Vector2.up * intensity);
			}
		}

		//Debug.Log ("velocity is " + body.velocity.y);
		if (body.velocity.y > MaxVelocity) {
			body.AddForce(Vector2.down * intensity);
		}
		if (body.velocity.y < MaxDownwardForce) {
			body.AddForce(Vector2.up * intensity);
		}

	}


	void SetupInitalColor(){
		ManagerReferences refs = GameObject.Find ("Manager").GetComponent<ManagerReferences> ();
		if (refs != null) {
			int colorsCount = refs.Colors.Length;
			int randomIndex = Random.Range (0, colorsCount - 1);
			Color newColor = refs.Colors [randomIndex];
			SpriteRenderer renderer = GetComponent<SpriteRenderer> ();
			renderer.color = newColor;

		}
	}
}

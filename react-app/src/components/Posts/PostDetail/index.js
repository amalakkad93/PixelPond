import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

export default function PostDetail() {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const isMountedRef = useRef(true);
}
